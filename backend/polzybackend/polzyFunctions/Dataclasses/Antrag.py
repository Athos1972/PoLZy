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
from polzybackend.polzyFunctions.utils.counter import Counter
from polzybackend.polzyFunctions.Dataclasses.PersonRoles import Roles
from polzybackend.polzyFunctions.Activities.Activity import Activity
from polzybackend.polzyFunctions.GlobalConstants import GlobalConstants
from polzybackend.polzyFunctions.Dataclasses.AntragsStatus import AntragsStatus
from polzybackend.polzyFunctions.AntragActivityRecorder import recordAntragDecorator
from polzybackend.polzyFunctions.Dataclasses.CommonFieldnames import CommonFieldnames
from polzybackend.polzyFunctions.Dataclasses.FieldCatalogManager import ManageFieldCatalog
from polzybackend.polzyFunctions.GamificationActivityRecorder import recordActivityDecorator
from polzybackend.polzyFunctions.ConfigurationEngine.ConfigurationProvider import ConfigurationProvider
from polzybackend.polzyFunctions.Activities.ActivitiesDataClasses import InputFields, FieldDataType, FieldTypes, \
    InputFieldTypes, FieldDefinition

logger = getLogger(GlobalConstants.loggerName)


@dataclass
class Antrag():
    id: uuid.UUID          # polzy
    user: User             # polzy
    productName: str       # polzy
    status: str            # polzy
    configurationProviderKey: str    # polzy
    Fields: InputFields()    # polzy
    Activities: [Activity]   # polzy
    searchstring: str = ""  # The search string contains a concatenation (with space) of all relevant properties  #POLZY

    def __init__(self, user):
        self.user = user
        self.bufferedFieldValuesForComparisonWithFrontend = {}
        self.Fields = InputFields()

        self.id = uuid.uuid4()
        self.tag = None
        self.antragsnummer = Counter().get_number()
        self.underWriterWarnings = {}

    # POLZY
    def loadActivitiesFromDict(self, activities: dict):
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
        return""

    # POLZY
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

    # POLZY
    @property
    def uuid(self):
        return str(self.id)

    # POLZY
    def returnLogID(self):
        return self.id

    # POLZY
    def set_user(self, user):
        self.user = user

    # POLZY, also the Decorator should go into Polzy.
    @recordAntragDecorator
    def setCustomTag(self, tag):
        logger.debug(f"Tag is set to {tag}")
        self.tag = tag

    # POLZY
    def updateAfterClone(self):
        #
        # update antrag props after cloning
        #

        # generate new ID
        self.id = uuid.uuid4()
        # clear tag
        self.tag = None

        # Copied Antrag needs new Antragsnummer
        self.antragsnummer = Counter().get_number()
        self.productName = self._generateProduktNameWithAntragsnummer()
        self.setSearchString()

    # POLZY (same as here without implementation.
    def getValueList(self, listName):
        # should be defined within specific antrag class
        raise ValueError(f'List with name {listName} not defined')

    # POLZY
    def getClauses(self) -> list:
        """
        Method (so far only used for printing) to retrieve a list of clauses and their texts.
        :return: List of lists [["1000k", "Special conditions"], ["1001k", "very special conditions]
        """
        raise NotImplementedError(f"The class {self.__class__.__name__} does not provide implementation for getClauses")

    # POLZY
    def getPremiumValues(self) -> dict:
        """
        Method (so far only for printing) to retrieve the annual premium, taxes and
        premium per payment frequency (if not annual)
        :return: as dict {"annualPrem": 13172,72, "taxPercent", 4.12, "taxValue": 512.23}
                 plus optional "premiumPerPeriod": 1097,67 if payment frequency is not annual.
        """
        raise NotImplementedError(f"The class {self.__class__.__name__} does not provide implementation for getClauses")

    # POLZY
    def getRemoteDocuments(self, documents_id: list):
        #
        # fetches document by <id>s from remote system and
        # returns local path to:
        # - the fetched file if there is the only is in the list
        # - a zip file with all the document
        #

        logger.debug(f"Files requested: {documents_id}")
        if not self.lDocumentsActivity:
            self.lDocumentsActivity = [activity for activity in self.Activities if activity.name == "Dokumente"][0]
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

        :param documents:
        :return:
        """
        return

    # POLZY - empty with documentation.
    def generateAntragEml(self):
        """

        :return:
        """
        return

    # POLZY
    def get_activity(self, activity_name, optional=False):
        activityObjects = [x for x in self.Activities if x.__class__.__name__ == activity_name]
        if not activityObjects:
            activityObjects = [x for x in self.Activities if x.name == activity_name]
            if not activityObjects and not optional:
                logger.critical(f"Cannot find activity: {activity_name}", stack_info=True)
        return activityObjects

    # POLZY
    def getPreviousVersions(self):
        # gets list of all AntragActivityRecords instances for current antragsnummer
        fmt = "%d-%m-%Y %H:%M:%S"
        versionsDict = {
            record.id: [
                record.timestamp.strftime(fmt),
                User.get_user_by_id(record.user_id).get("name"),
                record.status]
                    for record in AntragActivityRecords.getAllVersions(self.antragsnummer)
        }
        return versionsDict

    # POLZY
    def formatToString(self):
        return f"{self.status} {self.antragsnummer} {self.lineOfBusiness}"

    # POLZY
    def __repr__(self):
        return self.formatToString()

    # POLZY
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

    # Polzy
    def parseToFrontend(self):

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

    # POLZY
    def parseToFrontendFieldsWithoutGroup(self) -> list:
        """
        Fields, die nicht Feldgruppen sind und in keinen Feldgruppen zugordnet sind, werden hier ausgegeben.
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

    # POLZY
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

    # POLZY
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

    # POLZY
    def getCountOfPotentialPartners(self) -> int:
        """
        This method is used from AntragPartnerDefintionSingle in order to know, how many partners should be initially
        displayed on the screen. Each Antrag may and should override this method.
        :return: Number of Partners, that should be initially displayed in the partner card
        """
        return 1

    # POLZY
    def getPartnerRoles(self) -> list:
        """
        List of Partner Roles within this Antrag. Should be overwritten by each Antrag, if needed
        :return: Standard list: [VN, PZ]
        """
        return [Roles.VN, Roles.PZ]

    # POLZY
    def updateFieldValuesFromDatabase(self, updateValues):
        """
        This method is called after we load values from database. It's a bit tricky, we must load all the values but
        shall not execute any derviations (e.g. AnzahlBetriebsleiter from DU-Variant)
        :param updateValues:
        :return:
        """
        for k,v in updateValues.items():
            self.bufferedFieldValuesForComparisonWithFrontend[k] = v

        self.updateFieldValues(updateValues)

    # POLZY
    # POLZY
    def updateFieldValues(self, updateValues):
        """
        Frontend (or anything) sends new values for fields of antrag instance.
        If the values are really new/changed, we execute follow up processes.
        :param updateValues:
        :return:
        """
        logger.info(f'New Values (most probably from Frontend):\n{updateValues}')

        if AntragsStatus.getStatusNumberFromText(self.status) >= AntragsStatus.getStatusNumberFromText(
                AntragsStatus.s800_sent):
            self.announceMessage("Antrag bereits gesendet. Leider keine Änderug mehr möglich.")
            return

        self._updateFieldValues(updateValues)

    # POLZY - but keep this logic here.
    def _updateFieldValues(self, updateValues):
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

    # POLZY
    def _updateSingleFieldValueFromFrontendInternal(self, name, value):

        lUpdatedField = self.Fields.getField(name=name)
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

    # POLZY
    @recordActivityDecorator
    def createFieldcatalogForAntrag(self):
        return

    # POLZY
    def fillCurrentlyPossibleActivities(self):
        """
        Depending on status of this instance, product, client, etc. we'll derive the currently possible activities
        and store them in self.Activities for further use
        :return:
        """
        from fasifu.AntragActivitiesDerive import AntragActivitiesDerive
        lActivities = AntragActivitiesDerive(antrag=self)
        self.Activities = lActivities.getActivitiesForAntrag()

    # POLZY - but without logic
    def manageVersicherungsbeginn(self):
        return

    # POLZY
    def _addFieldForActivity(self, field: FieldDefinition):
        self.Fields.addField(field)

    # POLZY
    def _updateTechnicalFieldValuesAfterChange(self, field: FieldDefinition):
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

    # POLZY
    def __handleBooleanField(self, field):
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
        field.valueTech = self._formatStringVnG(field.value)
        field.valueOutput = self._formatStringOutput(field.value)

    def _determineProductName(self, returnValue=None):
        return

    # POLZY
    @staticmethod
    def __handleNumericField(field):
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
                if field.value:
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
        return

    def deriveDefaultsFromUserOrCompany(self):
        return

    # POLZY
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

    # POLZY
    def _toggleFieldGroupOnOff(self, listOfFieldgroupNamesToToggle: list, OnOffAsBoolean: bool):
        for fielgroup in listOfFieldgroupNamesToToggle:
            try:
                self.Fields.getField(name=fielgroup).value = OnOffAsBoolean
            except AttributeError:
                logger.critical(f"Field {fielgroup} not found. Typo? Forgot to add .value?")

    # POLZY
    def setFieldValue(self, fieldName, newValue):
        try:
            lFeld = self.Fields.getField(name=fieldName)
            lFeld.value = newValue
        except Exception as e:
            logger.critical(f"Should have written {newValue} into field {fieldName} "
                            f"and failed with error {e}. Most probably typo in Program.")
            raise AttributeError(f"Should have written {newValue} into field {fieldName} "
                                f"and failed with error {e}. Most probably typo in Program.")

    # POLZY
    def getFieldValue(self, fieldName, optional=False):
        try:
            return self.Fields.getField(name=fieldName).value
        except AttributeError:
            if not optional:
                lFields = ", ".join(sorted([x.name for x in self.Fields.getAllInputFields()]))
                logger.exception(f"Called for fieldname = {fieldName}. Doesn't exist! Existing Field names: {lFields}",
                                 stack_info=True)

    # POLZY
    def setFieldVisible(self, fieldName):
        try:
            lField = self.Fields.getField(name=fieldName)
            lField.fieldType = FieldTypes.visible
        except AttributeError:
            logger.exception(f"Field {fieldName} should be set visible. Doesn't exist. Most probaly a typo!")

    # POLZY
    def setFieldInvisible(self, fieldName, optional=False):
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

    # POLZY
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
