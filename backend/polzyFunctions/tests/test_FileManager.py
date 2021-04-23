from polzyFunctions.FileManager.Manager import Manager
from polzyFunctions.FileManager.DatabaseManager import DatabaseManager
from polzyFunctions.FileManager.AntragDataProcessor import AntragDataProcessor
from polzyFunctions.tests.utils import db
from unittest.mock import patch
from dataclasses import dataclass
import shutil
import os


@dataclass
class GlobalConstants:
    filesPath = "input/FileManagerTest"


def mock_move_processed_file(file):
    if os.path.exists(os.path.join(GlobalConstants.filesPath, file)):
        os.remove(os.path.join(GlobalConstants.filesPath, file))


def copy(src, dst):
    if not os.path.exists(src):
        src = GlobalConstants.filesPath + src
        shutil.copy(src, dst)
        os.remove(src)
    else:
        shutil.copy(src, dst)


@patch("polzyFunctions.FileManager.DatabaseManager.db", db)
@patch("polzyFunctions.FileManager.DatabaseManager.DatabaseManager.move_processed_file", mock_move_processed_file)
@patch("polzyFunctions.FileManager.DatabaseManager.shutil.move", copy)
@patch("polzyFunctions.FileManager.DatabaseManager.GlobalConstants", GlobalConstants)
@patch("polzyFunctions.FileManager.Manager.GlobalConstants", GlobalConstants)
def test_FileManager():
    lDatabaseManager = DatabaseManager()
    for unprocessed in lDatabaseManager.directly_added_files_from_dir:
        filename = os.path.join(GlobalConstants.filesPath, unprocessed.get_current_filename())
        Manager(filename, unprocessed.filename, unprocessed, [AntragDataProcessor])
        assert unprocessed.processed
        assert unprocessed.status_ok
        assert "processing_class" in unprocessed.details
    #     db.session.delete(unprocessed)
    # try:
    #     db.session.commit()
    # except Exception as ex:
    #     print(f"Exception while committing changes in db: {ex}")
    #     db.session.rollback()
    # assert 1 == 1
