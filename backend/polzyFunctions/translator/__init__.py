from polzyFunctions.utils import get_file_path, Singleton
from polzyFunctions.GlobalConstants import logger
from polzyFunctions.translator.DataHandler import Data


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
        result = self.data.get(word).get(language)
        if not result:
            result = word
            logger.info(f'Translation of "{word}" for language "{language}" not found!')
        return result

    def add_translation_dict(self, dict):
        # this method is to be used when we need to update translation from dictionary. It can be called in sub repo
        # for customer specific translations.
        # structure of input dictionary: {"English word": {"de": "translation for it", "wi": "translation for it", ...}}
        self.data.update(dict)

    def add_translation_file(self, fileNameAndPath):
        # this method is to be used when we need to update translation from json file. It can be called in sub repo
        # for customer specific translations.
        # structure in input json file: {"English word": {"de": "translation for it", "wi": "translation for it", ...}}
        fileNameAndPath = get_file_path(fileNameAndPath)
        dic = Data.get_data(fileNameAndPath)
        print(f"Updating translation data of file {fileNameAndPath}, data: {dic}")
        self.add_translation_dict(dic)

    def update_default_language(self, language):
        # this method is planned to be used to update default language of translation module as per current user
        self.default_language = language.lower()
