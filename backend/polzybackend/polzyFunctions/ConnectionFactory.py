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
    __instance__ = None

    def __init__(self):
        self.sessionDict = {}
        if SessionBuffer.__instance__ is None:
            SessionBuffer.__instance__ = self
        else:
            raise UserWarning("Session-Klasse schon initialisiert")

    @staticmethod
    def getInstance():
        if not SessionBuffer.__instance__:
            SessionBuffer()
        return SessionBuffer.__instance__

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
