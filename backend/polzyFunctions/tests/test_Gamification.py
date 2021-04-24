from polzyFunctions.Gamification import HitList
from polzyFunctions.scripts.GamificationStatsUpdater import run_loop
from polzyFunctions.scripts.AddNotification import get_company, get_user, update_notification
from polzybackend import models
from polzybackend.models import GamificationActivity, GamificationUserStats, GamificationEvent, ToastNotifications
from unittest.mock import patch
from polzyFunctions.tests.utils import db, user
import pytest


models.db = db

stats = db.session.query(GamificationUserStats).first()
events = db.session.query(GamificationEvent).all()
event_detail = '{"lineOfBusiness": "KFZ", "stage": "fqa", "sapClient": "120"}'


@patch("polzyFunctions.Gamification.db", db, user)
def test_HitList(user):
    lHitList = HitList()
    result = lHitList.deriveUserRanking(user)
    assert "daily" in result


def test_GamificationActivity(user):
    global activity
    activity = GamificationActivity.new(
        user=user, event=1, event_details=event_detail)
    assert activity


@patch("polzyFunctions.scripts.GamificationStatsUpdater.GamificationUserStats.create_or_update_row")
@patch("polzyFunctions.scripts.utils.db.session")
def test_GamificationStatsUpdater(mock, mock2):
    mock.query.return_value.all.return_value = [activity]
    run_loop(0)
    db.session.query(GamificationActivity).filter_by(id=activity.id).delete()
    try:
        db.session.commit()
    except Exception as ex:
        print(f"Exception while committing changes in db: {ex}")
        db.session.rollback()
    assert 1


def test_get_level_id():
    assert stats.get_level_id()


@pytest.mark.parametrize("event, detail", [
    (events[0], event_detail), (events[1], event_detail), (events[2], event_detail), (events[3], event_detail),
    (events[5], "{}")
])
def test_get_type_id(event, detail):
    assert isinstance(stats.get_type_id(event, detail), int)


@pytest.mark.parametrize("event, detail", [
    (events[0], event_detail), (events[1], event_detail), (events[2], event_detail), (events[3], event_detail),
    (events[5], "{}")
])
def test_get_weight(event, detail):
    assert isinstance(stats.get_weight(event, detail), int)


def test_ToastNotificationNew(user):
    message = "test message for pytest"
    ToastNotifications.new(message=message)
    company = db.session.query(models.Company).filter_by(name="Sample Organization").first().id
    update_notification(message, companies=company, users=user.id, type="default", duration=None,
                        horizontal="left", vertical="top")
    all = db.session.query(ToastNotifications).filter_by(message=message).all()
    assert len(all) > 0
    db.session.query(ToastNotifications).filter_by(message=message).delete()
    all = db.session.query(ToastNotifications).filter_by(message=message).all()
    assert len(all) == 0
