from polzyFunctions.GlobalConstants import logger
import json
from pathlib import Path
import os
import configparser
import codecs


class ConfigurationProvider:
    """
    Static/singleton class to provide configurations all over the application.

    We read JSON-Files with contents for the current configuration profile (might later be transformed into a
    database. If JSON-File was not found or doesn't have to configuration, that is searched for, we take from
    global configuration. If also there not found an error is documented.

    """

    def __init__(self, setting_file=Path(os.path.abspath(__file__)).parent.parent.joinpath("run_setting.ini")):
        logger.info("Executing __init__ in ConfigurationProvider")
        self.configsRead = {}
        self.badConfigs = {}
        # pathToConfig can and should be overwritten if needed otherwise:
        self.pathToConfig = Path(os.getcwd()).joinpath("Configurations")
        self.basePath = Path(os.getcwd())
        self.setting_file = setting_file
        if not self.pathToConfig.exists():
            self.pathToConfig = Path(os.path.abspath(__file__)).parent.parent.joinpath("Configurations")
            self.basePath = Path(os.path.abspath(__file__)).parent.parent
        result = self.__checkAndReadConfigurations("default")
        if not result:
            logger.critical("Default configuration was not found. Aborting.")
            raise NotImplementedError("Default configuration not found. Aborting.")
        self.language = "en"  # default fallback language is english
        self.offline, self.PDFOutput, self.defaultStage = self._get_default_data()

    def _get_default_data(self):
        stage = 'pqa'
        output_dir = ''
        offline = False
        try:
            config = configparser.ConfigParser()
            # pathlib.Path resolves issue of lowercase path stored in __file__ which was creating issue in configparser
            config.read(self.setting_file)
            default = config["Default"]
        except Exception as ex:
            logger.critical(f"Exception while reading config file: {ex}")
            return offline, output_dir, stage

        stage = default.get("stage", stage)

        unchecked_path = default.get("PDFOutput")
        try:
            if unchecked_path:
                Path(unchecked_path).mkdir(parents=True, exist_ok=True)
                output_dir = unchecked_path
        except Exception as ex:
            output_dir = ''
            logger.info(f"Error during Path creation: {ex}")

        if default.get("offline", "").lower().strip() == "true":
            offline = True
        return offline, output_dir, stage

    @staticmethod
    def getInstance():
        """
        Method to get the singleton instance into any calling class/form
        """
        if not ConfigurationProvider.__instance__:
            logger.info("ConfigurationProvider instance created")
            ConfigurationProvider()
        logger.debug("returning existing ConfigurationProvider")
        return ConfigurationProvider.__instance__

    def __checkAndReadConfigurations(self, configurationEnvironmentKey: str) -> bool:
        """
        See, if we had loaded this configuration already. If it was not loaded before, don't retry. Otherwise try to
        read it.

        :param configurationEnvironmentKey:
        :return: True if configuration was found or existed already. False if not found.
        """
        if configurationEnvironmentKey in self.configsRead.keys():
            return True

        if configurationEnvironmentKey in self.badConfigs.keys():
            logger.debug(f"Configuration {configurationEnvironmentKey} was already not found before. Not retrying.")
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
        Main method to retrieve a configuration setting. It will first try to read from the given
        configurationEnvironment. If that is not successful it will fallback to "default.json".

        If unsuccessful, we'll create a log message.

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


lConfigurationProvider = ConfigurationProvider()
