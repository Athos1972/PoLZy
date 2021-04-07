from polzyFunctions.utils import get_file_path, Singleton
from logging import getLogger
from fasifu.GlobalConstants import GlobalConstants
from polzyFunctions.translator.DataHandler import Data

logger = getLogger(GlobalConstants.loggerName)


class Translator(metaclass=Singleton):
    """
    We are making this class singleton to share same default language on multiple instances.
    """
    def __init__(self, default="en"):
        logger.debug("Language translation backend module initialized - buffered")
        self.default_language = default.lower()
        self.data = Data().data  # getting data from singleton class's attribute

    def translate(self, word, language=None):
        if not language:
            language = self.default_language
        language = language.lower()
        if language == "en":
            return word
        try:
            result = self.data.get(word).get(language)
        except:
            result = word
            logger.info(f'Translation of "{word}" for language "{language}" not found!')
        return result

    def add_translation_dict(self, dict):
        # FIXME Akash: please document. I can't find, where this s called.
        self.data.update(dict)

    def add_translation_file(self, fileNameAndPath):
        # FIXME Akash: please document. I can't find, where this is called
        fileNameAndPath = get_file_path(fileNameAndPath)
        self.add_translation_dict(Data.get_data(fileNameAndPath))

    def update_default_language(self, language):
        # FIXME Akash: Please document. I can't find, where this is called.
        self.default_language = language.lower()
