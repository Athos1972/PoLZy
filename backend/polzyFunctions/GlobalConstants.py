import logging
from dataclasses import dataclass


@dataclass
class GlobalConstants:
    loggerName: str = "Franzi"
    dateFormat: str = "%d-%m-%Y"


logger = logging.getLogger(GlobalConstants.loggerName)
