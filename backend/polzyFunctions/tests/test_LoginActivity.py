from polzyFunctions.Activities.LoginActivity import LoginActivity
from polzyFunctions.GamificationActivityRecorder import WriteActivity
from unittest.mock import patch


class fakeUserObject:
    def __init__(self):
        self.id = ""

    def to_json(self):
        return "{}"


@patch("polzyFunctions.GamificationActivityRecorder.WriteActivity")
def test_LoginActivity(mock):
    user = fakeUserObject()
    lLoginActivity = LoginActivity(user)
    assert lLoginActivity.record_login_activity()

