from polzyFunctions.Dataclasses.Antrag import Antrag
from polzyFunctions.tests.utils import db, user


def test_Antrag():
    antrag = Antrag(user)
    antrag.status = "test"
    antrag.lineOfBusiness = "test"
    antrag.productName = "test"
    antrag.parseToFrontend()
    antrag.parseToFrontendFieldGroupFields()
    antrag.parseToFrontendFieldGroups()
    antrag.parseToFrontendFieldsWithoutGroup()
    antrag.formatToString()
    antrag.getCountOfPotentialPartners()
    antrag.fillCurrentlyPossibleActivities()
    antrag.get_activity("test")
    assert antrag
