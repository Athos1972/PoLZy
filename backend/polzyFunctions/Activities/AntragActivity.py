from polzyFunctions.Dataclasses.Antrag import Antrag
from polzyFunctions.Activities.Activity import Activity
from polzyFunctions.GamificationActivityRecorder import recordActivityDecorator
from polzyFunctions.AntragActivityRecorder import recordAntragDecorator
from fasifu.GlobalConstants import GlobalConstants
from logging import getLogger


logger = getLogger(GlobalConstants.loggerName)


# POLZY
class AntragActivity(Activity):
    """
    All activities are called with an instance of Polizze and WirksamkeitsDatum (Effective date)

    The first call for each activity is to method 'checkIsActivityValidForPolicy'.
        For instance a cancel-activity will switch itself of, if the policy is already in status cancelled.
        The activity will not be offered to the user.

    Next a remote system would call 'getFieldsForActivity' method to know, which attributes need to be provided
        for this activity to run.

    It is advisable to call 'checkAndUpdateInput' if the attribute of an updated field has the value bool True
        in field inputTriggersComplexUpdates

    With method 'executeActivity' the activity is executed.

    Internally each activity will use or implement additional methods, e.g.
        'addFieldForActivity'
        'createFieldcatalogForActivity'

    """

    def __init__(self, antrag: Antrag, **kwargs):
        super(AntragActivity, self).__init__()
        self.antrag = antrag

    # POLZY
    def returnLogID(self):
        return self.antrag.id

    # POLZY
    def checkIsActivityValidForStatus(self) -> bool:
        """
        Festlegen, ob die gegenwärtige Aktivität für dieses Antragsobjekt zulässig ist oder nicht. Muss in jeder
        Aktivität ausgeprägt werden. Wenn man vergisst, gibt's eins auf die Fingerchen
        :return:
        """
        logger.exception(f"Activity not properly implemented! Doesn't know if it's valid for status or not! "
                         f"{self.__class__}")
        raise ValueError((f"Activity not properly implemented! Doesn't know if it's valid for status or not! "
                          f"{self.__class__}"))

    # POLZY
    def setSingleFieldValue(self, fieldNameToSearchFor, valueToSet):
        # This not only sets the field value but also executes the activites after field value was changed!
        self.updateFieldValues({fieldNameToSearchFor: valueToSet})

    # POLZY
    def setSingleFieldFieldType(self, fieldNameToSearchFor, fieldVisibilityTypeToSet):
        lFeld = self.antrag.Fields.getField(name=fieldNameToSearchFor)
        if lFeld:
            lFeld.fieldVisibilityType = fieldVisibilityTypeToSet
        else:
            logger.warning(f"Should have set FieldType {fieldVisibilityTypeToSet} for field {fieldNameToSearchFor}. But field"
                           f"is not there")

    # POLZY
    @recordAntragDecorator
    @recordActivityDecorator
    def executeActivity(self) -> bool:
        return super().executeActivity()