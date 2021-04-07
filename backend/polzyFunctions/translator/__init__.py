from logging import getLogger
from fasifu.GlobalConstants import GlobalConstants
from polzyFunctions.translator.DataHandler import Data

logger = getLogger(GlobalConstants.loggerName)


class Translator:
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