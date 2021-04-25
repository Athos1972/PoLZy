import os
from polzyFunctions.scripts import ExcelDBManager


def test_download():
    global file
    file = ExcelDBManager.download_excel()
    assert os.path.isfile(file)


def test_upload():
    ExcelDBManager.UploadExcel(file).upload_data()
    assert os.path.isfile(file)
    os.remove(file)
