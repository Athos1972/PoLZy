from requests import Session
from dataclasses import dataclass
from polzyFunctions.GlobalSystemConstants import GlobalSystemConstants

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
    """
    Meta class for connections. Needs to be implemented and subclassed in each installation
    """
    def __init__(self, *args, **kwargs):
        """
        Needs to be implemented for each backend system to connect to in an installation
        :param args:
        :param kwargs:
        """
        pass

    def connectionSetup(self) -> Session:
        """
        This method must be impleemented for each system. It should provide a Session object
        which can be used for all GET, PUT, POST, etc. requests.
        :return:
        """
        pass

    def executeGetRequestToURL(self, url: str, headers=None):
        return


class ConnectionFactory:
    """
    Connection factory should reply with an instance of ConnectorMeta
    """
    availableStages = globalSystemConstants.getAllStages()

    def __init__(self, stage):
        return

    def getConnector(self, endpointSystem: str, *args, **kwargs) -> ConnectorMeta:
        """
        The parameters are needed to identify which backend connector should be returned. This is only needed when
        there are more than one backend systems. Otherwise you can simply always return the same
        ConnectorMeta-Implementation
        :param endpointSystem:
        :param args:
        :param kwargs:
        :return:
        """
        return ConnectorMeta()
