import json
import pytest
from polzybackend import create_app
from config import Config
from uuid import uuid4

from polzyFunctions.Dataclasses.CommonFieldnames import CommonFieldnames
from polzyFunctions.tests.utils import user, company
from unittest.mock import patch


update_json = {
    "id": "", "values": {
        CommonFieldnames.expertMode.value: False, "Standarddaten": True, "Fahrzeugdaten": True, "Haftpflicht": True,
        "Kasko": True,"IU": True, "premium": "", "Fahrzeugart ": "PKW", "Marke ": "Renault",
        "eurotaxSearch ": "", "AlterZulassungsbesitzer ": "30", "PlzZulassungsbesitzer ": "1010",
        "BonusMalusStufe ": "0", "AlterFahrzeug ": "Neu", "Antriebsart ": "Benzin mit Kat",
        "CO2 ": "1", "KW ": "1", "HaftpflichtVSU ": "30 Mio", "Listenneupreis ": "1",
        "Sonderausstattung ": "", "Kaskovariante ": "Vollkasko genereller SBH",  "KaskoSBH ": "350",
        "IUVariante ": "Lenker- und Insassen", "IUTod ": "€ 20.000,00", "IUDI ": "€ 40.000,00"
    }
}

data = dict()
data['email'] = "pytest@polzy.com"
data['roles'] = {'agent': True}
stage = "pqa"


class MockGamificationBadge:
    @staticmethod
    def set_seen():
        return


@pytest.fixture(scope="module")
def client():
    app = create_app(Config)
    app.config['TESTING'] = True
    return app.test_client()


@pytest.fixture(scope="session")
def header(user):
    return {"Authorization": f"bearer {user.access_key}"}


def test_login(client, stage):
    res = client.post("/login", json=dict(email="admin@polzy.com", stage=stage, language="en"))
    assert res.get_json()["email"] == "admin@polzy.com"


def test_permission(client, user, company, header):
    res = client.post('/permissions', json={"id": company.id}, headers=header)
    assert res.get_json().get("permissions"), f"response: {res.get_json(), res.status_code}"


def test_get_policy(client, header):
    res = client.get("/policy/2045092221", headers=header)
    assert res.get_json()


def test_new_activity(client, header):
    res = client.post("/policy/activity", headers=header, json={
        'id': str(uuid4()), 'activity': {'name': 'Ruhestellung', 'fields': []}
    })
    assert res.get_json()


def test_get_antrag_products(client, header):
    res = client.get('/antrag/products', headers=header)
    assert len(res.get_json()) > 0


def test_get_admin_data(client, header):
    res = client.get("/admin", headers=header)
    assert res.get_json().get("possibleRoles") == ['admin', 'agent', 'clerk']


def test_manage_user_add(client, header, company):
    global data
    data['companyId'] = company.id
    res = client.post('/admin/user-company/add', headers=header, json=data)
    assert 'pytest@polzy.com' in json.dumps(res.get_json())


def test_manage_user_edit(client, header):
    global data
    data['roles'] = {'clerk': True}
    res = client.post('/admin/user-company/edit', headers=header, json=data)
    assert 'pytest@polzy.com' in json.dumps(res.get_json())


def test_manage_user_remove(client, header):
    res = client.post('/admin/user-company/remove', headers=header, json=data)
    assert 'pytest@polzy.com' not in json.dumps(res.get_json())


@pytest.mark.parametrize("action", ["add", "edit", "remove"])
@patch("polzybackend.administration.routes.db")
@patch("polzybackend.administration.routes.CompanyToCompany")
@patch("polzybackend.administration.routes.Company")
def test_manage_child_company(company, c2c, db, client, header, action):
    data = dict()
    data['parentCompanyId'] = 'pytest'
    data['childCompanyId'] = 'pytest'
    data['attributes'] = ''
    res = client.post(f'/admin/child-company/{action}', headers=header, json=data)
    assert res.status_code == 200


def test_badges(client, header):
    res = client.get('/badges', headers=header)
    assert res.status_code == 200


@patch("polzybackend.gamification.routes.filter")
def test_make_badge_seen(mock, client, header):
    mock.return_value = [MockGamificationBadge]
    res = client.post('/badges/seen', json={'badge': {'type': '', 'level': ''}}, headers=header)
    assert res.status_code == 200


def test_badge_types(client, header):
    res = client.get('/badges/types', headers=header)
    assert len(res.get_json()) == 11


def test_rankings(client, header):
    res = client.get("/rankings", headers=header)
    assert "daily" in res.get_json()


@patch("polzybackend.announce.routes.messenger")
@patch("polzybackend.announce.routes.db")
def test_notifications(mock, mock2, client, header):
    mock.session.query.return_value.filter_by.return_value.filter_by.return_value.filter_by.return_value.first.\
        return_value.message = "pytest"
    mock.session.query.return_value.filter_by.return_value.filter_by.return_value.filter_by.return_value.first.\
        return_value.type = "default"
    mock.session.query.return_value.filter_by.return_value.filter_by.return_value.filter_by.return_value.first. \
        return_value.duration = 3000
    mock.session.query.return_value.filter_by.return_value.filter_by.return_value.filter_by.return_value.first. \
        return_value.horizontal = "left"
    mock.session.query.return_value.filter_by.return_value.filter_by.return_value.filter_by.return_value.first. \
        return_value.vertical = "top"
    res = client.get('/notifications', headers=header)
    assert b'Notification' in res.get_data()


@patch("polzybackend.debug.routes.messenger")
def test_ping(mock, client):
    res = client.get('/ping')
    assert res.get_json() == {'success': 'data: {"text": "Fasifu message!"}\n\n'}


@patch("polzybackend.debug.routes.messenger")
@patch("polzybackend.debug.routes.db")
def test_newbadge(mock, mock2, client):
    res = client.get('/newbadge')
    assert res.status_code == 200


def test_get_users(client):
    res = client.get('/users')
    assert type(res.get_json()) == list
