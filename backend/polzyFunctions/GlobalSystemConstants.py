from dataclasses import dataclass
from fasifu.ConfigurationEngine.ConfigurationProvider import ConfigurationProvider
from functools import lru_cache
from fasifu.GlobalConstants import logger


@dataclass
class GlobalSystemConstants():

    @classmethod
    def getAllStages(self) -> list:
        """
        You need to subclass this class and add stages (e.g. DEV, Pre-Quality, Production).
        :return:
        """
        return []
