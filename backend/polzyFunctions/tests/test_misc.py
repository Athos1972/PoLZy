import os
import sys
from polzyFunctions.utils import get_file_path
from polzyFunctions.tests.utils import company, user
from polzyFunctions.scripts.AddNotification import *
from polzyFunctions.LogLevelUpdater import LogLevelUpdater
from polzyFunctions.FileManager.AddressParser import Parser


def test_get_file_path():
    get_file_path("test_misc.py")
    get_file_path("test_misc.py", os.getcwd())
    get_file_path("testing.py")


def test_AddNotification(company, user):
    sys.argv = []
    sys.argv.append("AddNotification.py")
    sys.argv.extend(["--message", "testing"])
    sys.argv.extend(["--company-id", "test"])
    sys.argv.extend(["--user-id", "test"])
    message = get_message()
    get_company()
    get_user()
    sys.argv = ["--company-name", "test"]
    sys.argv = ["--user-name", "test"]
    get_company()
    get_user()
    assert message


def test_logLevelUpdater():
    lLogLevelUpdater = LogLevelUpdater()
    lLogLevelUpdater.create_thread = False
    lLogLevelUpdater.startThread()
    for thread in lLogLevelUpdater.threads:
        thread.kill()


def test_AddressParser():
    lParser = Parser("100 street 10/11")
    address = lParser.to_dict()
    assert address["postCode"] == "100"
    assert address["street"] == "street"
    assert address["streetNumber"] == "10"
    assert address["houseNumber"] == "11"
