import os
import logging
from dataclasses import dataclass


@dataclass
class GlobalConstants:
    loggerName: str = "Franzi"
    dateFormat: str = "%d-%m-%Y"
    filesPath: str = "BatchFiles/"
    archivedFiles: str = os.path.join(filesPath, "processed/")


logger = logging.getLogger(GlobalConstants.loggerName)
