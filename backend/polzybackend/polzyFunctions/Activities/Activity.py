from polzybackend.polzyFunctions.Activities.ActivitiesDataClasses import InputFields, FieldTypes, FieldDefinition
from polzybackend.polzyFunctions.GlobalConstants import GlobalConstants
from polzybackend import messenger
from polzybackend.polzyFunctions.ConnectionFactory import ConnectionFactory
from polzybackend.polzyFunctions.ConfigurationEngine.ConfigurationProvider import ConfigurationProvider
from polzybackend.polzyFunctions.GamificationActivityRecorder import recordActivityDecorator
from polzybackend.polzyFunctions.AntragActivityRecorder import recordAntragDecorator
from polzybackend.polzyFunctions.Dataclasses.CommonFieldnames import CommonFieldnames
from datetime import datetime
from logging import getLogger
import json
import xml.dom.minidom
from polzybackend.polzyFunctions.Dataclasses.FieldCatalogManager import ManageFieldCatalog
from LogLevelUpdater import LogLevelUpdater
from requests import Session
from polzybackend.polzyFunctions.Activities.ActivitiesDataClasses import InputFields

logger = getLogger()


# POLZY
class Activity:
    """
    This is the template class for Activities. It's not called directly - just a template.

    """

    # constants to define post execution behavior of activity
    POSTEXECUTION_DEFAULT = 'default' # default behavior: update parent view
    POSTEXECUTION_LINK = 'link' # open link
    POSTEXECUTION_ACTIVE = 'active' # activity stays active after execution
    POSTEXECUTION_CLOSE = 'close' # close activity

    # parent instance flag
    PARENT_POLICY = 1
    PARENT_ANTRAG = 2

    def __init__(self):
        self.name = None           # set by each activity while intiating
        self.description = None    # set by each activity while intiating
        self.activityFields = InputFields()
        self.payload = None
        self.payloadJSON = None
        self.icon = None
        self.session: Session
        self.backendSystem = None  # Must be set by each activity before the execution
        self.stage = None
        self.latestResultFromRemoteRequest = None
        self.encrypt = False
        self.connectionToBackend = None   # fasifu

        # run --> default value
        # close --> closes activity
        # upload --> shows upload dialog
        # In case of run activity and any other (except "close"), the front-end makes call
        # to execute activity with new key activity (activity: activity.name) in payload.
        # usage: [{"name": "run", "caption": "Abschließen"}]
        self.frontendActions = []   # Actions, that are possible in the frontend for this Activity

        # post execution behavior of activity -- could redefined in activity if needed
        self.postExecuteBehavior = self.POSTEXECUTION_DEFAULT

        self.configurationProvider = ConfigurationProvider.getInstance()

    # Polzy with in fields, that are available in Polzy (e.g. not fileNameOfTemplate
    def toJsonForPersistence(self):
        return {
            "name": self.name,
            "description": self.description,
            "activityFields": self.activityFields.toJSON(),
            "payload": self.payload,
            "payloadJSON": self.payloadJSON,
            "icon": self.icon,
            "stage": self.stage,
            "postExecuteBehavior": self.postExecuteBehavior,
            "actions": self.frontendActions
        }

    # POLZY
    def loadFromJsonFromPersistence(self, dic):
        logger.debug(f"Updating {self.name} Activity class from json values.")
        for key, value in dic.items():
            if key == "activityFields":  # loading Field data in InputFields
                new_dic = {js.get("name"): (js.get("value") or js.get("valueChosenOrEntered")) for js in dic[key]}
                self.updateFieldValues(new_dic)
            else:
                setattr(self, key, value)
        return self

    # POLZY
    def announceMessage(self, message, duration=3000, level='default', horizontal='left', vertical='bottom'):
        """
        Please see docu in fasifu/Dataclasses/Antrag.py in announceMessage method
        :param message:
        :param duration:
        :param level:
        :param horizontal:
        :param vertical:
        :return:
        """
        logger.debug(f"Announce message: {message}")
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

    # POLZY (with decorators but without any content)
    @recordAntragDecorator
    @recordActivityDecorator
    def executeActivity(self) -> bool:
        return True

    # POLZY (with only bare logic without the call to HTTPHeaderGenerate, etc.).
    def _executePostRequestWithPayloadToURL(self, operation=None, usePutInsteadOfPost=None, headers=None):
        return

    # POLZY
    def _executeGetRequestToURL(self, url: str, headers="PoSSGet"):
        try:
            return self.connectionToBackend.executeGetRequestToURL(url=url, headers=headers)
        except Exception:
            self.announceMessage("Problem bei der Verbindung zu einem Service.", duration=0)

    # POLZY
    def updateFieldValues(self, updateValues):
        if not updateValues:
            return

        logger.debug(f'New Values: {updateValues}')
        for name, value in updateValues.items():
            if name == CommonFieldnames.addressDict.value:
                if isinstance(value, dict):
                    for k, v in value.items():
                        self._updateFieldValue(k, v)
                continue

            self._updateFieldValue(name, value)

    # Polzy
    def _updateFieldValue(self, name, value, optional=None):

        # set parent flag
        if hasattr(self, 'polizze'):
            parent_flag = self.PARENT_POLICY
        elif hasattr(self, 'antrag'):
            parent_flag = self.PARENT_ANTRAG
        else:
            logger.debug(f"Activity {self.name} is not assigned to any policy or antrag instance")
            return

        lUpdatedField = self.activityFields.getField(name=name)
        if not lUpdatedField:
            # policy cse
            if parent_flag == self.PARENT_POLICY:
                logger.debug(f"Field provided {name} with value {value}. But not in policy activity")

            # antrag case
            # Maybe field from Antrag, not from activity:
            lUpdatedField = self.antrag.Fields.getField(name=name)
            if not lUpdatedField:
                if not optional:
                    logger.error(f"Field provided {name} with value {value}. But not in activity nor in Antrag")
                else:
                    logger.debug(f"Field provided {name} with value {value}. But not in activity nor in Antrag. "
                                 f"'Optional' is set, so no problem.")
                return

        lUpdatedField.value = value
        try:
            if parent_flag == self.PARENT_ANTRAG:
                self.antrag._updateTechnicalFieldValuesAfterChange(lUpdatedField)
        except Exception as e:
            logger.exception(f"Error in _updateTechnicalFieldValuesAfterChange (or Methode doesn't exist). "
                             f"Class was {self.__class__.__name__}. Error: {e}. Field: {name}, "
                             f"Value: {value}")

    # POLZY
    def checkAndUpdateInputFields(self, inputFieldsToUpdate):
        """
        Here we can set Input Field values from external source. Each implementation will
        deal with the result differently
        :return:
        """

        if isinstance(inputFieldsToUpdate, InputFields):
            self.activityFields = inputFieldsToUpdate
        elif isinstance(inputFieldsToUpdate, FieldDefinition):
            lExistingField = self.activityFields.getField(name=inputFieldsToUpdate.name)
            lExistingField.__dict__.update(inputFieldsToUpdate.__dict__)
        elif isinstance(inputFieldsToUpdate, list):   # I guess this will be a list of Fields or one field
            for field in inputFieldsToUpdate:
                lExistingField = self.activityFields.getField(name=field.name)
                # Copy all attributes from newly added field into this field
                lExistingField.__dict__.update(field.__dict__)

    def _readTemplateXMLorJSON(self, fileNameOfTemplate=None):
        if fileNameOfTemplate:
            self.fileNameofTemplate = fileNameOfTemplate

        if not self.fileNameofTemplate:
            logger.exception("Kein Template File übergeben.")
            return

        with open(self.fileNameofTemplate, mode="r", encoding="UTF-8") as file:
            logger.debug(f"File {self.fileNameofTemplate} read.")
            if ".JSON" in str(self.fileNameofTemplate).upper():
                self.payloadJSON = json.loads(file.read())
                logger.debug(f"First 150 chars of template is: \n{str(self.payloadJSON)[0:150]}")
            else:
                self.payload = file.read()
                logger.debug(f"First 150 chars of template is: \n{str(self.payload)[0:150]}")

    # POLZY
    def _replaceVariablesInPayload(self):
        # Search in the payload string for $(<variablename>) and replace with either self.polizze or
        # self.inputFields

        expression = ""
        if self.payload:
            expression = self.payload
            self.payload = self._replaceVariable(expression)
        elif self.payloadJSON:
            self.payloadJSON = self._getExpressionFromJson(self.payloadJSON)
        if not expression:
            return

    # POLZY (without logic)
    def deriveDefaultsFromUserOrCompany(self):
        return

    # POLZY + documentation
    def _getExpressionFromJson(self, jsonData):
        """
        This method loop through every element of json data and replace the strings with prefix - postfix $( - )
        to its actual placeholder by calling method _replaceVariable
        :param jsonData:
        :return:
        """
        if type(jsonData) == list:
            lis = []
            for item in jsonData:  # loop through each element and call this method recursively
                lis.append(self._getExpressionFromJson(item))
            return lis
        elif type(jsonData) == dict:
            dic = {}
            for key, value in jsonData.items():  # loop through each data and call this method recursively
                dic[self._getExpressionFromJson(key)] = self._getExpressionFromJson(value)
            return dic
        elif type(jsonData) == str:  # if str then replace the placeholder and return the data, no recursion after this
            return self._replaceVariable(jsonData)
        else:
            return jsonData

    # POLZY
    def _replaceVariable(self, expression):
        if not "$(" in expression:
            return expression

        try:
            polizze = self.polizze
        except AttributeError:
            # In einem Antrag haben wir keine Polizze. Deshalb voll OK!
            pass

        try:
            antrag = self.antrag
        except AttributeError:
            pass

        while "$(" in expression:
            if expression[0:2] == "$(":
                left_part = ""
            else:
                left_part = expression.split("$(")[0]

            center = expression[len(left_part) + 2:]
            center = center.split(")")[0]

            try:
                right_part = expression[len(left_part) + len(center) + 3:]
            except Exception:
                right_part = ""

            # Left = part of payload before $( starts
            # right_part = part of payload after $(variable) ends
            # center = the <variable>-part inside $(<variable>)

            # center might be polizze.polizzenNummer or self.wirksamkeitsdatum
            if "." in center:
                lClassForAttribute = locals().get(center.split(".")[0])
                center = center.split(".")[1]
                try:
                    centerValue = getattr(lClassForAttribute, center)
                except Exception as e:
                    if hasattr(self, "polizze"):
                        logger.critical(f"Center war {center}, lClassForAttribute war: {lClassForAttribute}, "
                                        f"getattr hat nicht funktioniert. Polizze ist {self.polizze}. "
                                        f"Expression ist: {expression}. Locals waren : {locals()}")
                        raise ValueError("Fehler in _replaceVariable. Guckst Du Logs.")
                    elif hasattr(self, "antrag"):
                        logger.critical(f"Center war {center}, lClassForAttribute war: {lClassForAttribute}, "
                                        f"getattr hat nicht funktioniert. Polizze ist {self.antrag}. "
                                        f"Expression ist: {expression}. Locals waren : {locals()}")
                        raise ValueError("Fehler in _replaceVariable. Guckst Du Logs.")
            else:
                lClassForAttribute = self
                centerValue = None
                lFound = False
                try:
                    lField = lClassForAttribute.antrag.Fields.getField(name=center)
                    if lField.valueTech:
                        centerValue = lField.valueTech
                    else:
                        centerValue = lField.value
                    lFound = True
                except AttributeError:
                    pass

                if not centerValue and not lFound:
                    try:
                        lField = lClassForAttribute.activityFields.getField(name=center)
                        if lField.valueTech:
                            centerValue = lField.valueTech
                        else:
                            centerValue = lField.value
                    except AttributeError:
                        centerValue = getattr(lClassForAttribute, center)

            expression = "".join([left_part, str(centerValue), right_part])

        return expression

    # POLZY
    def _saveXMLorJSONResultAsPrettyPrinted(self, resultToPrint, operation: str = None):
        if not LogLevelUpdater().saveJson:
             return

        if not operation:
            operation = self.__class__.__name__

        try:
            lFileNameResult = f"{self.configurationProvider.basePath}/JsonFilesDelete/{self.polizze.polizzenNummer}_" \
                              f"{operation}_" \
                              f"{datetime.now().strftime(GlobalConstants.dateFormatLong)}_reply.json"
        except Exception:
            if hasattr(self, "antrag"):
                lFileNameResult = f"{self.configurationProvider.basePath}/JsonFilesDelete/" \
                                  f"Antrag_{self.antrag.sapClient}_" \
                                  f"{self.antrag.productName.replace('/', '_')}_" \
                                  f"{operation}_{datetime.now().strftime(GlobalConstants.dateFormatLong)}_reply.json"
            else:
                lFileNameResult = f"{self.configurationProvider.basePath}/JsonFilesDelete/" \
                                  f"UnknownRootObject_" \
                                  f"{operation}_{datetime.now().strftime(GlobalConstants.dateFormatLong)}_reply.json"

        if isinstance(resultToPrint, dict):
            try:
                with open(lFileNameResult, "w") as resultFile:
                    json.dump(resultToPrint, fp=resultFile, indent=4)
                logger.debug(f"File written: {lFileNameResult}")
                return
            except Exception as e:
                logger.critical(f"Fehler beim JSON-Dump {e}")
                return

        if not resultToPrint:
            logger.info("Should have printed result of call, but there was nothing in it.")
            return

        try:
            lDOMString = xml.dom.minidom.parseString(resultToPrint)
            with open(lFileNameResult, "w") as resultFile:
                resultFile.write(lDOMString.toprettyxml())
            logger.debug(f"File written: {lFileNameResult}")
            return
        except Exception as e:
            logger.debug(f"Fehler bei XML Dump: {e}, will fallback to text dump.")

        # If we can't write it as XML nor JSON, maybe we can save a text at least:
        try:
            with open(lFileNameResult, "w") as resultFile:
                resultFile.write(str(resultToPrint))
            logger.debug(f"File written {lFileNameResult}")
        except Exception as e:
            logger.critical(f"Error {e} during writing of interface file. Filename was {lFileNameResult}. "
                            f"resultToPrint was {resultToPrint}. Error as ")

    # POLZY
    def _getConnectionFactoryForActivity(self):
        lFactory = ConnectionFactory(stage=self.stage)
        self.connectionToBackend = lFactory.getConnector(endpointSystem=self.backendSystem,
                                                         sapClient=self.sapClient)
        self.session = self.connectionToBackend.connectionSetup()

    # POLZY
    def _addFieldForActivity(self, field: FieldDefinition):
        if not self.activityFields.getField(name=field.name):
            self.activityFields.addField(field)
        else:
            self.checkAndUpdateInputFields(field)

    # POLZY
    def createFieldcatalogForActivity(self):
        ManageFieldCatalog.addFields(self)
        self.checkAndUpdateInputFields(self.activityFields)

    @staticmethod
    def formatDateFieldForDateSelector(datetimeInput: datetime) -> str:
        return datetimeInput.strftime(GlobalConstants.dateFormat)

    def __str__(self):
        return self.__class__.__name__

    # POLZY
    def toJSON(self):
        frontendDict = {
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'postExecution': self.postExecuteBehavior,
            'fields': self.parseToFrontendFieldsWithoutGroup(),
            'actions': self.frontendActions,
        }

        lFieldGroups = self.parseToFrontendFieldGroups()
        if lFieldGroups:
            frontendDict.update(lFieldGroups)
            frontendDict.update(self.parseToFrontendFieldGroupFields())

        logger.debug(f"Activity dict for class {self.__class__.__name__} is \n {frontendDict}")
        return frontendDict

    # POLZY
    def parseToFrontendFieldsWithoutGroup(self) -> list:
        """
        Fields, die nicht Feldgruppen sind und in keinen Feldgruppen zugordnet sind, werden hier ausgegeben.
        :return:
        """
        lList = []

        for feld in self.activityFields.getAllInputFields():
            if feld.isGroupField:
                continue
            if feld.group:
                continue
            lList.append(feld.toJSON())

        return lList

    # POLZY
    def parseToFrontendFieldGroups(self) -> dict:
        """
        Loops through the list of Antrags fields and identifies group-fields (if any).
        If they exist, a list of group-fields is returnd.
        :return:
        """
        lList = []

        for feld in self.activityFields.getAllInputFields():
            if feld.isGroupField:
                countfields = [x.name for x in self.activityFields.getAllInputFields()
                               if x.group == feld.name and x.fieldType != FieldTypes.hidden]
                if countfields:
                    lList.append(feld)

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
        lReturnDict = {}
        for feld in self.activityFields.getAllInputFields():
            if feld.fieldType == FieldTypes.hidden:
                continue
            if feld.group:
                if lReturnDict.get(feld.group):
                    lReturnDict[feld.group].append(feld.toJSON())
                else:
                    lReturnDict[feld.group] = [feld.toJSON()]

        return lReturnDict
