import os
from polzyFunctions.GlobalConstants import GlobalConstants, logger
from polzyFunctions.FileManager.FileHandler import Handler
from polzyFunctions.FileManager.DataProcessor import Process
from polzyFunctions.FileManager.DatabaseManager import DatabaseManager


class Manager:
    """
    This package is used to manage uploaded files. It assigns unique id to those files and executes the appropriate
    antrag processing class with the data from file.
    Their will be multiple antrag processing classes in a project so all of those classes must by supplied with
    "classes" parameter. It will take a list of antrag classes as input.
    """
    def __init__(self, fileNameAndPath, original_filename, unprocessed_db_obj, classes: list):
        self.unprocessed_db_obj = unprocessed_db_obj  # used to set processed tag on failed files
        self.details = {os.path.basename(fileNameAndPath): {}}  # used to save necessary details in db
        self.processor = None
        self.classes = classes
        try:
            self.fileName, self.extension = self.sanitize_filename(fileNameAndPath)
            self.original_filename = original_filename
            self.fileHandler = Handler(self.fileName, self.original_filename, self.extension)
            self.data = self.fileHandler.data
            self.process_data()
        except Exception as ex:
            logger.critical(f"Exception while processing {os.path.basename(fileNameAndPath)}: {str(ex)}")
            self.details[os.path.basename(fileNameAndPath)]["status_ok"] = False
            self.details[os.path.basename(fileNameAndPath)]["error"] = str(ex)
            DatabaseManager.set_processed(os.path.basename(fileNameAndPath), self.unprocessed_db_obj, self.details)

    def sanitize_filename(self, fileNameAndPath):
        if not os.path.isfile(fileNameAndPath):
            logger.critical(f"{fileNameAndPath} doesn't exist. Skipping it!")
            raise Exception(f"{fileNameAndPath} doesn't exist")
        return fileNameAndPath, os.path.splitext(fileNameAndPath)[1].lower()

    def process_data(self):
        logger.debug("Processing data")
        self.processor = Process(self, self.classes)
        self.processor.process()
        DatabaseManager.set_processed(self.fileName, self.unprocessed_db_obj, self.details)
        logger.debug("Data processed")


if __name__ == "__main__":
    lDatabaseManager = DatabaseManager()
    if not lDatabaseManager.unprocessed_rows:
        logger.debug("No file to be processed!")
    for unprocessed in lDatabaseManager.unprocessed_rows:
        logger.debug(f"{unprocessed.filename} file with id {unprocessed.id} is ready to be processed")
        filename = os.path.join(GlobalConstants.filesPath, unprocessed.get_current_filename())
        m = Manager(filename, unprocessed.filename, unprocessed, [])


# command to execute this file as main
# python -m FileManager.Manager
