import os
import logging
from dataclasses import dataclass


@dataclass
class GlobalConstants:
    loggerName: str = "PoLZy"
    dateFormat: str = "%d-%m-%Y"
    dateFormatLong: str = "%Y%m%d_%H%M%S%f"
    filesPath: str = "BatchFiles/"
    archivedFiles: str = os.path.join(filesPath, "processed/")


logger = logging.getLogger(GlobalConstants.loggerName)
