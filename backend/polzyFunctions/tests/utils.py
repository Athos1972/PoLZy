from collections import namedtuple
from polzybackend.models import User, Company
from flask_sqlalchemy import SQLAlchemy
from polzyFunctions.Activities.ActivitiesDataClasses import InputFields
from polzyFunctions.Dataclasses.Antrag import Antrag
from polzyFunctions.Dataclasses.CommonFieldnames import CommonFieldnames
from polzybackend import create_app, models
from polzyFunctions.tests.config import Config
from copy import deepcopy
from polzyFunctions.ConfigurationEngine.ConfigurationProvider import lConfigurationProvider
import pytest
import json
from flask import current_app
import requests
import os

app = create_app(Config)
app.app_context().push()
db = SQLAlchemy(app)
models.db = db


# fakeUser = namedtuple("user", ["stage", "company", "language", "first_name", "last_name", "id"])
# companyName = namedtuple("company", "name")
# company = namedtuple("company", ["company", "attributes"])
# wstv = company(companyName("WSTV"), {"Products": ["WohnenDon"]})


def initFakeUser(stage="pqa", email="admin@polzy.com",
                 localDatabase=None):  # ldb is used to supply db instance to avoid conflicts
    if localDatabase:
        models.db = localDatabase
        realUser: models.User = deepcopy(localDatabase.session.query(models.User).filter_by(email=email).first())
    else:
        realUser: models.User = deepcopy(db.session.query(models.User).filter_by(email=email).first())
    #    agent = models.User.query.filter_by(email='agent@polzy.com').first()
    realUser.stage = stage
    return realUser


def setAntagInputValue(antragsinstanz: Antrag, name: str, newValue, noDirectUpdate=False):
    valueList = antragsinstanz.Fields
    lFranzi = valueList.getField(name=name)
    if lFranzi:
        lFranzi.value = newValue
        if not noDirectUpdate:
            antragsinstanz._updateTechnicalFieldValuesAfterChange(lFranzi)


def setActivityFields(fieldCatalog: InputFields, fieldname: str, valueToSet: str):
    lField = fieldCatalog.getField(name=fieldname)
    lField.value = valueToSet


def getFieldValue(antragsFelder, fieldName):
    lFeld = antragsFelder.getField(name=fieldName)
    if lFeld:
        return lFeld.value
    else:
        return None


def updateKFZAntragWithDummyFields(antrag: Antrag):
    antrag.lineOfBusiness = "KFZ"
    # dummy values for Antrag:
    setAntagInputValue(antrag, "KW", 70)
    setAntagInputValue(antrag, "CO2", 50)
    setAntagInputValue(antrag, "Aussereuropaeische", False)
    setAntagInputValue(antrag, "Rabatt", "0")
    setAntagInputValue(antrag, "BonusMalusStufe", 7)
    setAntagInputValue(antrag, "Listenneupreis", 15000)

    lFieldsToNull = ["ModerneKriminalitaet", "IU", "Aussereuropaeische", "Pannenhilfe", "ZusatzpaketLight",
                     "ZusatzpaketElektronik", "ZusatzpaketLuxus", "Kaufpreisersatz", "Leasingfahrzeug",
                     "GAPDeckung", "GrobeFahrlaessigkeit", "NeuwertDeckung", "MWSTBefreit"]
    for field in lFieldsToNull:
        setAntagInputValue(antrag, field, False)


def updateAntragWithDummyAddressFields(antrag: Antrag):
    if not antrag.lineOfBusiness:
        antrag.lineOfBusiness = "PnC"
    # Dummy address values for Antrag.
    # Adresse
    setAntagInputValue(antrag, CommonFieldnames.country.value, "AT")
    setAntagInputValue(antrag, CommonFieldnames.postCode.value, "1120")
    setAntagInputValue(antrag, CommonFieldnames.city.value, "Wien")
    setAntagInputValue(antrag, CommonFieldnames.street.value, "Dörfelstraße")
    setAntagInputValue(antrag, CommonFieldnames.streetNumber.value, "10")
    setAntagInputValue(antrag, CommonFieldnames.houseNumber.value, "5")


@pytest.fixture(scope="session")
def isOnline():
    return not lConfigurationProvider.offline


@pytest.fixture(scope="session")
def user():
    return db.session.query(User).first()


@pytest.fixture(scope="session")
def company():
    return db.session.query(Company).filter_by(name="Sample Organization").first()


def compare_cloned_to_old_entries(clonedValues, originalValues):
    lDifferentEntriesClonedToOld = 0
    lDifferentEntriesOldToCloned = 0
    if isinstance(clonedValues, dict) and isinstance(originalValues, dict):
        clonedValues = [clonedValues]  # we are expecting only list containing dict/s in further logic
        originalValues = [originalValues]

    print("*** Deviation cloned to original values/variables:")
    for field in clonedValues:
        try:
            x = [x for x in originalValues if x["name"] == field["name"]][0]
        except IndexError:
            print(f"Field {field} of cloned instance exists not in original instance")

        if (not x.get("value") or x["value"] == "None") \
                and (not field.get("value") or
                     field["value"] == "False"):
            continue

        if x.get("value") != field.get("value"):
            print(f"Field-Value of field {field['name']} is {field.get('value', 'not existing')} in "
                  f"cloned instance and {x.get('value', 'not existing')} in original instance")

            lDifferentEntriesClonedToOld += 1

    print("*** Deviation original to cloned values/variables:")
    for field in originalValues:
        try:
            x = [x for x in clonedValues if x["name"] == field["name"]][0]
        except IndexError:
            print(f"Field {field} of old instance exists not in new instance")

        if (not x.get("value") or x["value"] == "False") \
                and (not field.get("value") or
                     field["value"] == "None"):
            continue

        if x.get("value") != field.get("value"):
            print(f"Field-Value of field {field['name']} is {field.get('value')} in "
                  f"original instance and {x.get('value')} in cloned instance")
            lDifferentEntriesOldToCloned += 1

    print(f"***** {lDifferentEntriesClonedToOld} entries different between cloned instance to original and "
          f"{lDifferentEntriesOldToCloned} entries different vice versa")

    assert lDifferentEntriesOldToCloned + lDifferentEntriesClonedToOld == 0


def upload_file(user, antrag_id, fileNameAndPath, fileType):
    res = requests.post(f"http://localhost:5000/api/upload/{antrag_id}/{fileType}",
                        headers={'authorization': f'Bearer {user.access_key}'},
                        files={'file': (os.path.basename(fileNameAndPath), open(fileNameAndPath, 'rb'))})
    return res
