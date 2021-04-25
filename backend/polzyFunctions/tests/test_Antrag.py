from polzyFunctions.Dataclasses.Antrag import Antrag
from polzyFunctions.tests.utils import db, models, user, company
from polzyFunctions.Activities.Activity import Activity
from polzyFunctions.LogLevelUpdater import LogLevelUpdater
from polzybackend.models import AntragActivityRecords


antrag = Antrag(user)
lActivity = Activity()
lActivity.antrag = antrag

# this values are added to avoid errors
antrag.status = "test"
antrag.lineOfBusiness = "test"
antrag.productName = "test"
antrag.user.id = "test"
antrag.user.stage = "test"
antrag.sapClient = "test"


def test_Antrag(company):
    antrag.user.company_id = company.id  # using real company id to avoid errors
    antrag.parseToFrontend()
    antrag.parseToFrontendFieldGroupFields()
    antrag.parseToFrontendFieldGroups()
    antrag.parseToFrontendFieldsWithoutGroup()
    antrag.formatToString()
    antrag.getCountOfPotentialPartners()
    antrag.fillCurrentlyPossibleActivities()
    antrag.get_activity("test")
    assert antrag


def test_recordDecorators():
    antrag.Activities = [lActivity]
    antrag.searchstring = "test"
    lActivity.encrypt = True
    antrag.Activities = [lActivity]
    antrag.createFieldcatalogForAntrag()  # recordActivityDecorator
    antrag.setCustomTag("test")  # recordAntragDecorator
    assert antrag.tag == "test"


def test_Activity():
    dic = lActivity.toJsonForPersistence()
    lActivity.loadFromJsonFromPersistence(dic)
    lActivity._replaceVariablesInPayload()
    assert dic


def test_getExpressionFromJson():
    assert "test" in lActivity._getExpressionFromJson("$(self.antrag.productName)")
    assert lActivity._getExpressionFromJson(["$(stage)"]) == ["None"]
    lActivity.stage = "test"
    assert lActivity._getExpressionFromJson({"$(stage)": "$(stage)"}) == {"test": "test"}
    LogLevelUpdater().saveJson = True
    lActivity._saveXMLorJSONResultAsPrettyPrinted('{"test": "success"}')
    lActivity._saveXMLorJSONResultAsPrettyPrinted({"test": "success"})
