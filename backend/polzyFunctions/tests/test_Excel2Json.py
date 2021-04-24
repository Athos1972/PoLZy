import sys
import os
from unittest.mock import patch
from polzyFunctions.scripts.Excel2Json import *


args = [
    "Excel2Json.py", "--file", "input/Excel2Json.xlsx", "--sheetname", "data", "--start-row", "1",
    "--end-row", "2", "--key-column", "1", "--value-column", "2"
]


@patch.object(sys, "argv", args)
def test_Excel2Json():
    args_read()
    print_args()
    assert os.path.isfile("data.json")
    os.remove("data.json")
