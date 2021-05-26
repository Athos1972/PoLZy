import os
import sys
import json
import codecs
from datetime import datetime
from polzyFunctions.FileManager.AddressParser import Parser
from polzyFunctions.GlobalConstants import GlobalConstants, logger
from dateutil.parser import parse
from polzyFunctions.Dataclasses.CommonFieldnames import CommonFieldnames


with codecs.open(os.path.join(os.path.dirname(os.path.abspath(__file__)
                                              ), "attrs_to_headers.json"), encoding="utf-8") as file:
    headers_dic = json.load(file)

headers = []
dateObj = headers_dic["dateObj"]
valid_headers = headers_dic["valid"]
skipped_headers = headers_dic["skip"]
for key in headers_dic["headers"]:
    for header in headers_dic["headers"][key]:
        headers.append(header)


def setActivities(instance, data: dict):
    logger.debug("Setting fields")
    data = updateFieldDataName(data)
    for key, value in data.items():
        if key == "Versicherungsbeginn":
            instance.setFieldValue(CommonFieldnames.policyBeginDate.value, value)
            continue
        instance.setFieldValue(key, value)
    logger.debug("Fields set.")


def updateFieldDataName(data):
    sanitized_data = dict()
    for key, value in data.items():
        if key not in valid_headers:  # then most probably this key contains value of some other keys in it -
            try:
                sanitize = getattr(sys.modules[__name__], key.lower())(value)    # e.g. name is first_name and last_name
                sanitized_data.update(sanitize)
            except Exception as ex:
                logger.critical(f"Found new header: {key}. This shouldn't be the case. Error was {ex}")
        elif key in dateObj:  # if key is in date object category that means we need to convert value in datetime object
            processed = returnDate(value)
            sanitized_data[key] = processed
        else:
            if key not in skipped_headers:  # if key in skipped headers, that means current we want to avoid those keys.
                sanitized_data[key] = value
            else:
                logger.debug(f"{key} skipped.")
    return sanitized_data


def name(fullname):
    dic = dict()
    dic["firstName"] = " ".join(fullname.split(" ")[:-1])
    dic["lastName"] = fullname.split(" ")[-1]
    return dic


def address(fulladdress):
    lAddress = Parser(fulladdress)
    return lAddress.to_dict()


def returnDate(string):
    # some fields need date object, so we are using dateutils here to get date object
    try:
        dt = parse(string).strftime(GlobalConstants.dateFormat)
    except Exception as ex:
        logger.critical(f"Unable to parse date: {string}. Error was {ex}")
        dt = datetime.now().strftime(GlobalConstants.dateFormat)
    return dt


def sanitizeHeader(value):
    for key in headers_dic["headers"]:  # looping through headers & removing all spaces & symbols to match with field
        if value.lower().strip(
        ).replace(" ", "").replace("_", "").replace("-", "").replace(".", "") in headers_dic["headers"][key]:
            return key
    print(value.lower().strip().replace(" ", "").replace("_", "").replace("-", "").replace(".", ""))

