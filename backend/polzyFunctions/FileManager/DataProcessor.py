import os
from polzyFunctions.GlobalConstants import logger


class Process:
    def __init__(self, managerInstance, classes: list):
        self.managerInstance = managerInstance
        self.data = self.managerInstance.data
        self.classes = classes  # will contain all class names that are used in file processing instance

    def get_data_processing_class(self, data, fileName, original_filename):
        for class_ in self.classes:  # loop through all & ask class if it can process data
            if class_.check_processable(data=data, filename=os.path.basename(fileName), original_filename=original_filename):
                logger.debug(f"{class_.__name__} is the assigned class for processing.")
                return class_
        raise ValueError(f"Unable to find class relation")

    def process(self):
        email = self.managerInstance.unprocessed_db_obj.user.email  # to create instance for target user
        for filename in self.data:
            if isinstance(self.data[filename], dict):  # if data type is dict that it contains, error so updating it
                self.managerInstance.details[filename] = self.data[filename]                            # in details
                continue
            for data in self.data[filename]:
                try:
                    self.managerInstance.details[filename] = {"processing_class": "", "status_ok": True}
                    class_ = self.get_data_processing_class(data, filename, self.managerInstance.original_filename)
                    self.managerInstance.details[filename]["processing_class"] = class_.__name__
                    processing_class = class_(email=email, **data)
                    self.managerInstance.details[filename]["processing_class_messages"] = processing_class.details
                except Exception as ex:
                    logger.critical(f"Exception while processing: {str(ex)}")
                    self.managerInstance.details[filename]["error"] = str(ex)
                    self.managerInstance.details[filename]["status_ok"] = False
