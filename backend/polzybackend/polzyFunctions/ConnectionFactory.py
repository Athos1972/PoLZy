from requests import Session
from logging import getLogger
from dataclasses import dataclass
from polzybackend.polzyFunctions.GlobalConstants import GlobalConstants
from polzybackend.polzyFunctions.GlobalSystemConstants import GlobalSystemConstants

logger = getLogger(GlobalConstants.loggerName)
globalSystemConstants = GlobalSystemConstants()


@dataclass
class BackendSystemConnectorClasses():
    backendDict = {}


class SessionBuffer(object):
    # This class must be a singleton class, but due to conflict in overriding methods of subclass we can't make this
    # base class as singleton. Hence, wherever this class is inherited the sub class should be a singleton class
    # See the sample code of a subclass below:
    #
    # class SessionBufferSubClass(SessionBuffer):
    #     __instance__ = None
    #
    #     def __init__(self):
    #         super().__init__()
    #         if SessionBuffer.__instance__ is None:
    #             SessionBuffer.__instance__ = self
    #         else:
    #             raise UserWarning("Session-Klasse schon initialisiert")
    #
    #     @staticmethod
    #     def getInstance():
    #         if not SessionBuffer.__instance__:
    #             SessionBuffer()
    #         return SessionBuffer.__instance__
    #
    # Make sure to have __instance__ as class attribute, condition in __init__ to assign self to __instance__ if not
    # their & a staticmethod getInstance which you will call where ever you need this class instance.

    def __init__(self):
        self.sessionDict = {}

    def getSession(self, stage, sapClient):
        return


class ConnectorMeta:
    def __init__(self, *args, **kwargs):
        pass

    def connectionSetup(self) -> Session:
        pass

    def executeGetRequestToURL(self, url: str, headers="PoSSGet"):
        return


class ConnectionFactory:
    availableStages = globalSystemConstants.getAllStages()

    def __init__(self, stage):
        return

    def getConnector(self, endpointSystem: str, sapClient: str, *args, **kwargs) -> ConnectorMeta:
        return
