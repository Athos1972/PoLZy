import os
import json
import uuid
import locale
import zipfile
from logging import getLogger
from dataclasses import dataclass
from polzybackend import messenger
from polzybackend.models import User, AntragActivityRecords
from datetime import datetime, timedelta
from polzyFunctions.utils.counter import Counter
from polzyFunctions.Dataclasses.PersonRoles import Roles
from polzyFunctions.Activities.Activity import Activity
from polzyFunctions.GlobalConstants import GlobalConstants
from polzyFunctions.Dataclasses.AntragsStatus import AntragsStatus
from polzyFunctions.AntragActivityRecorder import recordAntragDecorator
from polzyFunctions.Dataclasses.CommonFieldnames import CommonFieldnames
from polzyFunctions.GamificationActivityRecorder import recordActivityDecorator
from polzyFunctions.ConfigurationEngine.ConfigurationProvider import ConfigurationProvider
from polzyFunctions.Activities.ActivitiesDataClasses import InputFields, FieldDataType, FieldTypes, \
    InputFieldTypes, FieldDefinition

logger = getLogger(GlobalConstants.loggerName)


@dataclass
class Antrag():
    """
    THE main component of LeZyTOR (Tariff Online Calculator). In this class (and all inheriting classes) we handle
    instances of fastOffers.
    Main attributes:
    Fields: Fieldcatalog - please see documentation in there
    Activities: Activities for this instance. Usually you'd have a few static activities and most of the activities
           would be depending on a) the product or b) the status of the instance. In this list of Activities are only
           activities, which are currently allowed for this instance.
    """
    id: uuid.UUID          # Unique ID
    user: User             # User from Fronteend
    productName: str       #
    status: str            # current status of this instance.
    # Key to use in configurationProvider to search for configuration values. Usually you'd have one configuration
    # provider per insurance company as fallback and e.g. one configuration provider for each sales channel.
    # Depends largely on the use-case of POLZY
    configurationProviderKey: str
    Fields: InputFields()    # Field catalog for this product
    Activities: [Activity]   # Currently allowed activities in this instance.
    # The search string contains a concatenation (with space) of all relevant properties for a quick search when we
    # want to reload persisted instances from the database.
    searchstring: str = ""

    def __init__(self, user):
        self.user = user
        # bufferedFieldValuesForComparisonWithFrontend is updated after each roundtrip with the frontend. When we
        # get a request to send an instance via parseToFrontend-Method we store the latest values in this dict.
        # Upon receiving the new values from the frontend in updateFieldValues we can use this dict to identify or
        # compare changed values.
        self.bufferedFieldValuesForComparisonWithFrontend = {}
        self.Fields = InputFields()

        self.id = uuid.uuid4()
        # The Tag is used in frontend (and saved to database) to set custom tags in order to find the instance
        # later, independently of the product, id or other search fields. An example of usage would be a clerk, who
        # calculates multiple offers and multiple Products for Mrs. Smith (not yet a customer). He would tag them with
        # "Smith" and later use search functionality to find all of them.
        self.tag = None
        # Additionally to the unique id (self.id) we generate a human readable instance number. Can be overwritten.
        self.antragsnummer = Counter().get_number()
        # In this dict we collect warning for underwriters, e.g. when a person has a negative mark or certain
        # field combinations raise warning. When those warnings are set the instance wouldn't automatically be sent
        # to Backend system but would raise those warnings in a final screen. Apart from the dict itself there is no
        # logic inside PoLZy. You'll have to develop the reaction to this field in your installation.
        self.underWriterWarnings = {}

    def loadActivitiesFromDict(self, activities: dict):
        """
        # FIXME Akash
        :param activities:
        :return:
        """
        for classname, value in activities.items():
            instance = None
            for old_instance in self.Activities:  # if instance of same activity is already their than update it
                if old_instance.__class__.__name__ == classname:
                    instance = old_instance
                    logger.debug(f"Found existing instance of {classname}. Using it to update persistence values.")
                    instance.loadFromJsonFromPersistence(value)
                    break
            if not instance:  # if no existing instance of activity found than create a new and add to list
                logger.debug(f"No instance found of {classname}. Creating New.")
                class_ = "fasifu.Activities." + classname  # used to dynamically import module
                if classname == "AntragClone":  # AntragClone class's module name is not same. Hence updating it
                    class_ += "Copy"
                mod = __import__(class_, fromlist=[''])  # Importing class object from module
                instance = getattr(mod, classname)(self)  # creating Activity instance
                instance.loadFromJsonFromPersistence(value)
                self.Activities.append(instance)
            logger.debug(f"{classname} loading successful.")

    def setSearchString(self):
        """
        Method to set the search string, e.g. during initializiation or when the Tag was changed. Implement in your
        own installation. Most probably specific for each product.
        :return:
        """
        return""

    def handleUnderWriterWarnings(self, section, warningToAdd, textToAdd=None):
        """
        This dict will hold warnings for underwriters. It has a section, within the section a key and a text.
        :param section: A freely usable term, that will help the underwriter to understand, where the problem happened
        :param warningToAdd: a technical key (used to prevent continuous nagging of the user with the same message
        :param textToAdd: The text, that will be displayed for the underwriters
        :return: true if a change happend (remove or add). False if there was no change to the dict.
        """

        if not self.underWriterWarnings.get(section):
            self.underWriterWarnings[section] = {}

        if not textToAdd:  # We shall remove this warning, if exists
            try:
                del self.underWriterWarnings[section][warningToAdd]
                if not self.underWriterWarnings.get(section, "empty") != "empty":
                    del self.underWriterWarnings[section]
                return True   # There was a key, which is now removed.
            except KeyError:
                pass
            return False   # The key did not exist, so no changes happened.

        if self.underWriterWarnings[section].get(warningToAdd) == textToAdd:
            return False
        self.underWriterWarnings[section][warningToAdd] = textToAdd
        return True

    @property
    def uuid(self):
        return str(self.id)

    # FIXME Akash: please check, if we need that.
    def returnLogID(self):
        return self.id

    def set_user(self, user):
        self.user = user

    @recordAntragDecorator
    def setCustomTag(self, tag):
        logger.debug(f"Tag is set to {tag}")
        self.tag = tag

    def updateAfterClone(self):
        """
        After an instance was cloned do here some cleanup work. Can and should be overwritten in each installation.
        :return:
        """

        # generate new ID
        self.id = uuid.uuid4()
        # clear tag
        self.tag = None

        # Copied Antrag needs new Antragsnummer
        self.antragsnummer = Counter().get_number()
        self.productName = self._generateProduktNameWithAntragsnummer()
        self.setSearchString()

    def getValueList(self, listName):
        """
        long lists should not be transferred to the frontend in each request. Instead we can hand them over once. Each
        listName is unique. You should provide here the values for the frontend.
        :param listName: name of the list-object
        :return: Values of the list object for the frontend
        """
        # should be defined within specific antrag class
        raise ValueError(f'List with name {listName} not defined')

    def getClauses(self) -> list:
        """
        Method (so far only used for printing) to retrieve a list of clauses and their texts.
        :return: List of lists [["1000k", "Special conditions"], ["1001k", "very special conditions]
        """
        raise NotImplementedError(f"The class {self.__class__.__name__} does not provide implementation for getClauses")

    def getPremiumValues(self) -> dict:
        """
        Method (so far only for printing) to retrieve the annual premium, taxes and
        premium per payment frequency (if not annual)
        :return: as dict {"annualPrem": 13172,72, "taxPercent", 4.12, "taxValue": 512.23}
                 plus optional "premiumPerPeriod": 1097,67 if payment frequency is not annual.
        """
        raise NotImplementedError(f"The class {self.__class__.__name__} does not provide implementation for getClauses")

    def getRemoteDocuments(self, documents_id: list):
        """
        This method is called from frontend for retrieving documents, that are either stored or generated
        or taken from anther source (like a remote DMS-System).
        :param documents_id: list of document names, that shall be retrieved. If the list is longer than 1 the result
                             should be sent as ZIP-File.
        :return: a filename containing the requested document(s)
        """
        # FIXME Akash: Move the contents back to fasifu.
        #
        # fetches document by <id>s from remote system and
        # returns local path to:
        # - the fetched file if there is the only is in the list
        # - a zip file with all the document
        #
        logger.debug(f"Files requested: {documents_id}")
        if not self.lDocumentsActivity:
            self.lDocumentsActivity = self.get_activity("Dokumente")[0]
        files = []
        for document in documents_id:
            files.append(self.lDocumentsActivity.generateDocument(document))
        if len(files) > 1:
            zipname = f'{self.lDocumentsActivity.lPdfGenerator.class_.VNLastName}_{self.antragsnummer}_Dokumente.zip'
            zippath = os.path.join(self.configurationProvider.PDFOutput, zipname)
            zipf = zipfile.ZipFile(zippath, 'w', zipfile.ZIP_DEFLATED)
            for document in files:
                zipf.write(document, os.path.basename(document))
            file = os.path.join(os.getcwd(), zippath)
            zipf.close()
        else:
            file = files[0]
        return file

    # POLZY - empty with documentation
    def generateEml(self, documents):
        """
        This method is called from frontend when an E-Mail is requested.
        :param documents: list of documents, that should be included in the E-Mail
        :return: EML-Binary file
        """
        return

    # POLZY - empty with documentation.
    def generateAntragEml(self):
        """
        This method is called form frontend to create the application form and send it via E-Mail (EML-File)
        :return: EML-File
        """
        return

    def get_activity(self, activity_name, optional=False):
        """
        Retrieve an activity from the list of Activities in this instance by class name
        :param activity_name: class name of the desired activity
        :param optional: Don't raise an error if the activity can't be found
        :return: the activity
        """
        activityObjects = [x for x in self.Activities if x.__class__.__name__ == activity_name]
        if not activityObjects:
            activityObjects = [x for x in self.Activities if x.name == activity_name]
            if not activityObjects and not optional:
                logger.critical(f"Cannot find activity: {activity_name}", stack_info=True)
        return activityObjects

    def getPreviousVersions(self):
        """
        gets list of all AntragActivityRecords instances for current antragsnummer
        :return:
        """
        fmt = "%d-%m-%Y %H:%M:%S"
        versionsDict = {
            record.id: [
                record.timestamp.strftime(fmt),
                User.get_user_by_id(record.user_id).get("name"),
                record.status]
                    for record in AntragActivityRecords.getAllVersions(self.antragsnummer)
        }
        return versionsDict

    def formatToString(self):
        """
        String-Representation (used in __repr__ and __str__) about this instance.
        :return:
        """
        return f"{self.status} {self.antragsnummer} {self.lineOfBusiness}"

    def __repr__(self):
        return self.formatToString()

    def __str__(self):
        return self.formatToString()

    # POLZY
    def getSpeedometerValue(self):
        """
        Derives speedometer value

        Possible returned values:
        None -- do not show speedometer in front-end
        0-1000 -- show speedometer with given value

        Should be implemented by each Antrag class. Default = None
        :return:
        """

        return None

    def parseToFrontend(self):
        """
        Creates the JSON that is sent as payload to the frontend
        :return: the JSON
        """

        try:
            lActivitiesJson = [a.toJSON() for a in self.Activities]
            logger.debug(f"lActivitiesJSON hat den Wert: {lActivitiesJson}")
        except Exception as e:
            lActivitiesJson = {}
            logger.critical(f"Fehler bei Aktiviäten JSONisierung: {e}")

        frontendDict = {
            'id': self.uuid,
            'tag': self.tag,
            "number": self.antragsnummer,
            'status': self.status,
            'product_line': {
                'name': self.lineOfBusiness,
                'attributes': {
                    'Produkt': self.productName
                },
            },
            'possible_activities': lActivitiesJson,
            'fields': self.parseToFrontendFieldsWithoutGroup(),
            'speedometerValue': self.getSpeedometerValue(),
        }

        lFieldGroups = self.parseToFrontendFieldGroups()
        if lFieldGroups:
            frontendDict.update(lFieldGroups)
            frontendDict.update(self.parseToFrontendFieldGroupFields())

        logger.debug(f"Antrag for Frontend class {self.__class__.__name__} is:\n {frontendDict}")

        return frontendDict

    def parseToFrontendFieldsWithoutGroup(self) -> list:
        """
        Fields, that are not part of field groups and not hidden are jsonified here
        :return:
        """

        # get list of fields which are:
        # 1) not groups
        # 2) not in a group
        # 3) not hidden

        lList = list(map(
            lambda feld: feld.toJSON(),
            filter(
                lambda feld: not feld.isGroupField and not feld.group and feld.fieldType != FieldTypes.hidden,
                self.Fields.getAllInputFields()
            )
        ))

        return lList

    def parseToFrontendFieldGroups(self) -> dict:
        """
        Loops through the list of Antrags fields and identifies group-fields (if any).
        If they exist, a list of group-fields is returned, where empty field-groups (with no displayable fields) are
        ommitted.
        :return:
        """
        lList = self.Fields.getAllFieldGroups()
        lAllInputFields = self.Fields.getAllInputFields()

        lDropFieldGroupEntries = []
        for fieldGroup in lList:
            # Field-Groups, that are not displayed anyway should not be transferred:
            if not fieldGroup.value and fieldGroup.name != CommonFieldnames.expertenModus.value and fieldGroup.name != CommonFieldnames.AussagenGroup.value:
                lDropFieldGroupEntries.append(fieldGroup)
                continue

            # Field-Groups, that don't have any visible fields inside them shall not be transferred:
            fieldList = [x.name for x in lAllInputFields if x.group == fieldGroup.name
                         and x.fieldType != FieldTypes.hidden]
            if not fieldList and not fieldGroup.name == CommonFieldnames.expertenModus.value and not fieldGroup.name == CommonFieldnames.AussagenGroup.value:
                lDropFieldGroupEntries.append(fieldGroup)

        for lDropfieldGroupEntry in lDropFieldGroupEntries:
            lList.remove(lDropfieldGroupEntry)

        if lList:
            return {"field_groups": [x.toJSON() for x in lList]}

        return {}

    def parseToFrontendFieldGroupFields(self) -> dict:
        """
        Will create one dict for each field-group in the field-catalog
        lDict[<groupname>] = [list of FieldDefinition.toJSON()

        :return:
        """
        lGroups = self.Fields.getAllFieldGroups()
        lReturnDict = {}
        for feld in self.Fields.getAllInputFields():
            if feld.group:
                # If the fieldGroup is not displayed, we shall not send any fields:
                lGroup = [x for x in lGroups if x.name == feld.group][0]
                if not lGroup.value and lGroup.name != CommonFieldnames.expertenModus.value and lGroup.name != CommonFieldnames.AussagenGroup.value:
                    continue
                # Don't send fields, which are not displayed on Frontend.
                if feld.fieldType != FieldTypes.hidden:
                    # add field group to the response
                    if lReturnDict.get(feld.group) is None:
                        lReturnDict[feld.group] = []
                    lReturnDict[feld.group].append(feld.toJSON())

        return lReturnDict

    def getCountOfPotentialPartners(self) -> int:
        """
        This method is used from AntragPartnerDefintionSingle in order to know, how many partners should be initially
        displayed on the screen. Each Antrag may and should override this method.
        :return: Number of Partners, that should be initially displayed in the partner activity cards
        """
        return 1

    def getPartnerRoles(self) -> list:
        """
        List of Partner Roles within this Antrag. Should be overwritten by each Antrag, if needed
        :return: Standard list: [VN, PZ]
        """
        return [Roles.VN, Roles.PZ]

    def updateFieldValuesFromDatabase(self, updateValues):
        """
        This method is called after we load values from database. It's a bit tricky, we must load all the values but
        shall not execute any derviations (e.g. AnzahlBetriebsleiter from DU-Variant)
        :param updateValues: the field list from database
        :return:
        """
        for k,v in updateValues.items():
            self.bufferedFieldValuesForComparisonWithFrontend[k] = v

        self.updateFieldValues(updateValues)

    def updateFieldValues(self, updateValues):
        """
        Frontend (or anything) sends new values for fields of antrag instance.
        If the values are really new/changed, we execute follow up processes.
        :param updateValues: dict of {<field>:<value>}
        :return: Nothing
        """
        logger.info(f'New Values (most probably from Frontend):\n{updateValues}')

        if AntragsStatus.getStatusNumberFromText(self.status) >= AntragsStatus.getStatusNumberFromText(
                AntragsStatus.s800_sent):
            self.announceMessage("Antrag bereits gesendet. Leider keine Änderug mehr möglich.")
            return

        self._updateFieldValues(updateValues)

    def _updateFieldValues(self, updateValues):
        """
        Internal Method to update field values. May be overwritten in each implementation.
        :param updateValues:
        :return:
        """
        # FIXME Akash: Please remove the logic and just keep _updateSinglefieldValueFromFrontend(name, value) in the loop. The rest of the logic should go to fasifu!
        for name, value in updateValues.items():
            if name == CommonFieldnames.Kundenname.value:
                self.__updateFieldValueOfKundenname(value)
                continue

            if name == CommonFieldnames.addressDict.value or \
                    name == CommonFieldnames.risikoAdressDict.value:
                # address fields come in dict "address". We shall process them field by field.
                if isinstance(value, dict):
                    for k, v in value.items():
                        self._updateSingleFieldValueFromFrontendInternal(k, v)
                # Save the addressDict contents in order to provide it back to the frontend.
                self._updateSingleFieldValueFromFrontendInternal(CommonFieldnames.addressDict.value, value)
                continue

            self._updateSingleFieldValueFromFrontendInternal(name, value)

    def _updateSingleFieldValueFromFrontendInternal(self, name, value):
        """
        This method is called for a single field/value-combination.
        :param name: the fieldname, that was updated
        :param value: the new value
        :return:
        """

        lUpdatedField = self.Fields.getField(name=name)
        # fixme akash: Please move this logic back to fasifu and keep only _updateTechnicalFieldValuesAfterChange-call here.
        if not lUpdatedField:
            if name not in ["firmenArten", "resultstring"]:
                # if it's not a known "rogue" field then let's have a message in the log
                logger.critical(f"Fieldname {name} does not exist in Field-List! Value sent for it was {value}",
                                stack_info=True)
        else:
            if lUpdatedField.fieldDataType == InputFieldTypes.TYPENUMERIC and value:
                lUpdatedField.value = int(value)
            else:
                lUpdatedField.value = value

            self._updateTechnicalFieldValuesAfterChange(lUpdatedField)

    @recordActivityDecorator
    def createFieldcatalogForAntrag(self):
        """
        When called, this method will create the field catalog for this instance.
        :return:
        """
        return

    def fillCurrentlyPossibleActivities(self):
        """
        Depending on status of this instance, product, client, etc. we'll derive the currently possible activities
        and store them in self.Activities for further use
        :return:
        """
        # fixme Akash: Please move this implementation back to fasifu. We should have a dummy implementation of AntragActivitiesDerive in Polzy and call that here.
        from fasifu.AntragActivitiesDerive import AntragActivitiesDerive
        lActivities = AntragActivitiesDerive(antrag=self)
        self.Activities = lActivities.getActivitiesForAntrag()

    def _addFieldForActivity(self, field: FieldDefinition):
        """
        This method is called during building the field catalog and will insert one single new field into self.Fields.
        :param field:
        :return:
        """
        self.Fields.addField(field)

    def _updateTechnicalFieldValuesAfterChange(self, field: FieldDefinition):
        """
        When we recive values from the frontend they are in JSON and strings. Internally we know from the field-catalog
        which field types those fields have. Here we convert them into the internal format.
        :param field:
        :return:
        """
        if field.fieldDataType == FieldDataType(InputFieldTypes.TYPEBOOLEAN) or \
                field.fieldDataType == FieldDataType(InputFieldTypes.TYPEFLAGFULLLINE):
            self.__handleBooleanField(field)
        elif field.fieldDataType == FieldDataType(InputFieldTypes.TYPENUMERIC):
            self.__handleNumericField(field)
        elif isinstance(field.value, datetime):
            field.valueOutput = field.value.strftime(GlobalConstants.dateFormat)
            field.valueTech = field.value

        else:
            field.valueTech = field.value
            field.valueOutput = field.value

    def __handleBooleanField(self, field):
        """
        If the planned field data type is boolean we shall interpret string field values and try to identify
        true or false.
        :param field:
        :return:
        """
        # Wenn der geplante Felddatentyp Boolen ist, aber ein String daher kommt, dann den String umfummeln.
        # TYPEFLAGFULLINE is also boolean, but covers a full line in UI.
        if isinstance(field.value, str):
            # Wenn statt boolean der String daher kommt, dann den string umfummeln.
            if field.value.upper() in ["TRUE", "JA", "ENTHALTEN"]:
                field.value = True
            elif field.value.upper() in ["FALSE", "NEIN", "NONE"]:
                field.value = False
            else:
                logger.critical(f"Value for boolean field {field.name} was {field.value}. "
                                f"Wasn't able to determine True/False from that. I'll assume 'No'.")
                field.value = False

        # FIXME: Akash: Please move those back to FASIFU and instead have here valueTech = value, valueOutput = value.
        field.valueTech = self._formatStringVnG(field.value)
        field.valueOutput = self._formatStringOutput(field.value)

    def _determineProductName(self, returnValue=None):
        """
        Method to overwrite the productName. Should be subclassed/overwritten in each installation
        :param returnValue: Additional value that can be passed to influence the result.
        :return:
        """
        return

    @staticmethod
    def __handleNumericField(field):
        """
        Handle potential string input (from frontend) and transform into internal values (Integer, Float) if possible
        :param field:
        :return:
        """
        if not field.value:
            field.value = None
            return

        if field.decimalPlaces > 0 and field.fieldType == 2:
            # Output-Field should have Value formatted for the UI
            if isinstance(field.value, float):
                field.value = locale.currency(field.value,
                                              grouping=True, symbol=False)
            field.valueTech = field.value
            field.valueOutput = field.value

        elif field.decimalPlaces > 0:
            try:
                field.value = float(field.value)
                field.valueTech = field.value
                field.valueOutput = locale.currency(field.value,
                                                    grouping=True, symbol=False)
            except ValueError:
                field.value = None
                field.valueTech = None
                field.valueOutput = None
        else:
            try:
                field.value = int(field.value)
            except ValueError as e:
                if field.value == 'None':
                    field.value = None
                    field.valueTech = None
                    field.valueOutput = None
                    return
                logger.warning(f"Value {field.value} can't be converted to int. Error was {e}")
            field.valueTech = field.value

            if field.value > 10_000:
                # This is pretty sure a sum insured and should be written as decimal number.
                field.valueOutput = locale.currency(field.value,
                                                    grouping=True, symbol=False)
            else:
                field.valueOutput = locale.format_string(f="%.0f",
                                                         val=field.value,
                                                         grouping=True)

    @staticmethod
    def _formatStringOutput(inValue):
        # FIXME Akash: Not need. remove here please.
        return

    def deriveDefaultsFromUserOrCompany(self):
        """
        In case the installation has user or company dependent attributes for Antrags-instances here is the
        place to derive them.
        :return:
        """
        return

    def _toggleFieldsOnOff(self, listOfFieldnamesToToggle: list, OnOffAsBoolean: bool):
        """
        Provide a list of fieldnames and "True" if fields shoulds be on (FieldType = 1) or
        "False" if fields should be off (FieldType = 3
        :param listOfFieldnamesToToggle: List for field name
        :param OnOffAsBoolean: True = On (show), False = Off (hide)
        :return:
        """

        for field in listOfFieldnamesToToggle:
            from fasifu.Dataclasses.BUFTFieldnames import BUFTFieldnames
            if field.startswith(BUFTFieldnames.Kuendigungsverzicht.value) and OnOffAsBoolean:
                breakpoint()

            if OnOffAsBoolean:
                self.setFieldVisible(field)
            else:
                self.setFieldInvisible(field)

    def _toggleFieldGroupOnOff(self, listOfFieldgroupNamesToToggle: list, OnOffAsBoolean: bool):
        """
        Toggle a list of fieldgroups (=Cards on the UI) on or off by setting the value of the field-group to True/False
        :param listOfFieldgroupNamesToToggle: List of the names of the fieldgroups to be effected
        :param OnOffAsBoolean: True = On, False = Off
        :return:
        """
        for fielgroup in listOfFieldgroupNamesToToggle:
            try:
                self.Fields.getField(name=fielgroup).value = OnOffAsBoolean
            except AttributeError:
                logger.critical(f"Field {fielgroup} not found. Typo? Forgot to add .value?")

    def setFieldValue(self, fieldName, newValue, optional=False):
        """
        Write a new value into a field of this instance.

        :param fieldName:
        :param newValue:
        :param optional: don't raise an error/write to log, if field does not exist
        :return:
        """
        try:
            lFeld = self.Fields.getField(name=fieldName)
            lFeld.value = newValue
        except Exception as e:
            if not optional:
                logger.critical(f"Should have written {newValue} into field {fieldName} "
                                f"and failed with error {e}. Most probably typo in Program.")
                raise AttributeError(f"Should have written {newValue} into field {fieldName} "
                                    f"and failed with error {e}. Most probably typo in Program.")
            else:
                logger.debug(f"Should have written {newValue} into field {fieldName} "
                             f"and failed with error {e}. Most probably typo in Program. Optional was set, so Ok!")

    def getFieldValue(self, fieldName, optional=False):
        """
        Retrieve the field.value from fieldName
        :param fieldName:
        :param optional: Don't write log entry, if the field does not exist
        :return:
        """
        try:
            return self.Fields.getField(name=fieldName).value
        except AttributeError:
            if not optional:
                lFields = ", ".join(sorted([x.name for x in self.Fields.getAllInputFields()]))
                logger.exception(f"Called for fieldname = {fieldName}. Doesn't exist! Existing Field names: {lFields}",
                                 stack_info=True)

    def setFieldVisible(self, fieldName):
        """

        :param fieldName:
        :return:
        """
        try:
            lField = self.Fields.getField(name=fieldName)
            lField.fieldType = FieldTypes.visible
        except AttributeError:
            logger.exception(f"Field {fieldName} should be set visible. Doesn't exist. Most probaly a typo!")

    def setFieldInvisible(self, fieldName, optional=False):
        """

        :param fieldName:
        :param optional: Don't write log, if field doesn't exist in the field catalog
        :return:
        """
        try:
            lField = self.Fields.getField(name=fieldName)
            lField.fieldType = FieldTypes.hidden
            if lField.value and lField.fieldDataType == FieldDataType(InputFieldTypes.TYPEBOOLEAN):
                lField.value = False
        except Exception:
            if optional:
                logger.debug(f"Field {fieldName} should be set invisible. Doesn't exist. "
                             f"'Optional' is set, so most likely Ok")
            else:
                logger.exception(f"Field {fieldName} should be set invisible. Doesn't exist. Most probaly typo!")

    @staticmethod
    def announceMessage(message, duration=3000, level='default', horizontal='left', vertical='bottom'):
        """
        Will send a toast to the frontend
        :param message: The message text.
        :param duration: None = user needs to click "close" in order to disappear, any other value in MilliSeconds
                         until the Toast disappears
        :param level: 'info' will provide blue background with white font,
                      'default' will provide black background with white font,
                      'success' will bring green backgroudn
                      'error' --> red background
                      'warning' --> orange background
        :param horizontal: "left", "right", "center"
        :param vertical: "bottom", "top"
        :return:
        """
        logger.debug(f"Announce: {message}")
        msg = json.dumps({
            'text': message,
            'autoHideDuration': duration,
            'variant': level,
            'anchorOrigin': {
                'horizontal': horizontal,
                'vertical': vertical,
            }
        })
        messenger.announce(f"data: {msg}\n\n")
