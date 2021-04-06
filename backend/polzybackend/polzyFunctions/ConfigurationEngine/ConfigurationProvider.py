from polzybackend.polzyFunctions.GlobalConstants import GlobalConstants
import logging
import json
from pathlib import Path
from os import getcwd
import configparser
import codecs


logger = logging.getLogger(GlobalConstants.loggerName)


class ConfigurationProvider:
    """
    Static class to provide configurations all over the application.

    We read JSON-Files with contents for the current configuration profile (might later be transformed into a
    database. If JSON-File was not found or doesn't have to configuration, that is searched for, we take from
    global configuration. If also there not found an error is documented.

    """
    __instance__ = None

    def __init__(self):
        logger.info("Executing __init__ in ConfigurationProvider")
        self.configsRead = {}
        self.badConfigs = {}
        # pathToConfig can and should be overwritten if needed otherwise:
        self.pathToConfig = Path(getcwd()).joinpath("Configurations")
        self.basePath = Path(getcwd())
        if not self.pathToConfig.exists():
            self.pathToConfig = Path(getcwd()).parent.joinpath("Configurations")
            self.basePath = Path(getcwd()).parent
        if ConfigurationProvider.__instance__ is None:
            ConfigurationProvider.__instance__ = self
        else:
            raise UserWarning("Session-Klasse schon initialisiert")

        result = self.__checkAndReadConfigurations("default")
        if not result:
            logger.critical("Default configuration was not found. Aborting.")
            raise NotImplementedError("Default configuration not found. Aborting.")
        self.language = "en"  # default fallback language is english
        self.offline = self.getOfflineModeState()
        self.PDFOutput = self.get_pdf_output_path()

    @staticmethod
    def get_pdf_output_path():
        output_dir = ''
        try:
            config = configparser.ConfigParser()
            config.read("run_setting.ini")
            unchecked_path = config["Default"]["PDFOutput"]
        except Exception as ex:
            logger.info(f"Exception while checking offline state: {ex}")
            return output_dir
        try:
            Path(unchecked_path).mkdir(parents=True, exist_ok=True)
            output_dir = unchecked_path
        except Exception as ex:
            output_dir = ''
            logger.info(f"Error during Path creation: {ex}")
        return output_dir

    @staticmethod
    def getOfflineModeState():
        offline = False
        try:
            config = configparser.ConfigParser()
            config.read("run_setting.ini")
            if config["Default"]["offline"].lower().strip() == "true":
                offline = True
        except Exception as ex:
            logger.info(f"Exception while checking offline state: {ex}")
        return offline

    @staticmethod
    def getInstance():
        if not ConfigurationProvider.__instance__:
            logger.info("ConfigurationProvider instance created")
            ConfigurationProvider()
        logger.debug("returning existing ConfigurationProvider")
        return ConfigurationProvider.__instance__

    def __checkAndReadConfigurations(self, configurationEnvironmentKey: str) -> bool:
        """

        :param configurationEnvironmentKey:
        :return: True if configuration was found or existed already. False if not found.
        """
        if configurationEnvironmentKey in self.configsRead.keys():
            return True

        if configurationEnvironmentKey in self.badConfigs.keys():
            logger.debug(f"Configuration {configurationEnvironmentKey} was not found before. Not retrying.")
            return False

        configReadResult = ConfigurationProvider.__readConfigurationFromFile(
            self.pathToConfig.joinpath(f"{configurationEnvironmentKey}.json"))

        if configReadResult:
            self.configsRead[configurationEnvironmentKey] = configReadResult
            return True
        else:
            self.badConfigs[configurationEnvironmentKey] = True
            return False

    @staticmethod
    def __readConfigurationFromFile(fileNameAndPath):
        lJson: None
        try:
            with codecs.open(fileNameAndPath, "r", encoding="utf8") as file:
                lJson = json.load(file)
                return lJson
        except Exception as e:
            logger.warning(f"Couldn't load JSON-Config from file {fileNameAndPath}. Error was {e}")
            return False

    def getConfigurationParameter(self, configurationEnvironmentKey: str, configKeyToSearchFor: str):
        """

        :param configurationEnvironmentKey: Environment key (e.g. sapClient)
        :param configKeyToSearchFor: The key in either default Configuration or manually set configuration
        :return: the value of the configuration entry.
        """
        lEnvironmentExists = self.__checkAndReadConfigurations(configurationEnvironmentKey)
        if not lEnvironmentExists:
            lReturn = self.configsRead["default"].get(configKeyToSearchFor)
        else:
            lReturn = self.configsRead.get(configurationEnvironmentKey, {}).get(configKeyToSearchFor)
            if not lReturn:
                lReturn = self.configsRead["default"].get(configKeyToSearchFor)

        if not lReturn:
            logger.critical(f"Configuration key {configKeyToSearchFor} not found in "
                            f"current configuration {configurationEnvironmentKey} nor in default configuration.")
            return False

        return lReturn
