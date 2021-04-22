from .utils import initFakeUser
from polzyFunctions.FileManager.utils import setActivities, sanitizeHeader
from polzyFunctions.GlobalConstants import logger
from datetime import datetime
from polzyFunctions.Dataclasses.Antrag import Antrag
from polzyFunctions.ConfigurationEngine.ConfigurationProvider import lConfigurationProvider


class AntragDataProcessor:
    """
    This class is a sample & base class. All the antrag processing classes should be made with similar structure or
    should inherit this class and override methods and attributes as per requirements.
    """
    def __init__(self, email=None, **kwargs):
        self.kwargs = kwargs
        self.data = self.sanitize_data()  # first process the data to get correct header names.
        self.details = {
            "messages": [f"ANTRAG_CLASSNAME instance initiated at {str(datetime.now())}"],  # example of storing messages
            "errors": []
        }  # is used to gather necessary event details and later update in db

        # Please override this attribute in and store here the antrag instance for which this class was made
        #self.antragInstance = Antrag(user=initFakeUser(lConfigurationProvider, email=email or "admin@polzy.com"))

        # Below are the attributes which are mainly dependent on you antrag instance and the logic of how you need to
        # use that data
        # self.activities = ["AntragBerechnen", "AntragVNSuchenAnlegen", "AntragDrucken", "AntragErzeugenVnG"]
        #self.set_fields()  # as of current antrag which we used as sample we need this
        # try:
        #     self.execute_activities()  # as of current antrag which we used as sample we need this
        #     # example of adding message. Please use the same logic for storing success message
        #     self.details["messages"].append("autopolzyRS instance executed successfully")
        # except Exception as ex:
        #     # example of storing error. Please use the same logic for storing error
        #     self.details["errors"].append(f"executing activities failed: {str(ex)}")

    def sanitize_data(self):
        """
        This method should not be override in inherited class. We have all logic here and json file here which contains
        correct data to determine correct header
        :return:
        """
        data = dict()
        for k, value in self.kwargs.items():  # coverting header into correct field name
            key = sanitizeHeader(k)
            if not key:
                logger.warning(f"Can't find field for header {k}")
                self.details["errors"].append(f"Can't find field for header {k}")  # example of storing error
            data[key] = value
        return data

    def set_fields(self):
        setActivities(self.antragInstance, self.data)

    def execute_activities(self):
        # logic of activity execution here. Modify and use it as per your antrag class logic
        return

    @classmethod
    def check_processable(cls, data: dict, filename: str, original_filename=""):
        """
        This is an important method which should be override in inherited class. Please define the logic here to
        see if the data or filename has any hint which leads to believe that the data should be processed by this class.
        Please refer the logic below for further knowledge.
        :param data:
        :param filename:
        :param original_filename:
        :return:
        """
        # we try to find flags here which can determine if this class can process targetted data
        for key in data.keys():  # trying to see if data has as particular thing which only belongs to current antrag
            if key.lower().strip() == "product" or key.lower().strip() == "produkt":
                if data[key].lower() == "rs" or data[key].lower() == "rechtschutz":
                    logger.info(f"{cls.__class__.__name__} will process data")
                    return True
        if "rs_" in filename.lower() or "rechtschutz" in filename.lower():  # else try to determine it with classname
            return True
        elif "rs_" in original_filename.lower() or "rechtschutz" in original_filename.lower():
            return True
        logger.info("No class found to process data")
        return False


