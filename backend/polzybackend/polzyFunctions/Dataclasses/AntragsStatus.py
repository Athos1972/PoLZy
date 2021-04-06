from dataclasses import dataclass


@dataclass
class AntragsStatus:
    statusDict = {
        000: "New",
        100: "Calculated",
        150: "Printed",
        400: "Customer registered",
        450: "Application questions answered",
        500: "Documents printed",
        550: "Documents signed",
        800: "Sent"
    }
    s000_new = "New"
    s100_calculated = "Calculated"
    s150_printed = "Printed"
    s400_RegisteredCustomer = "Customer registered"
    s450_QuestionsAnswered = "Application questions answered"
    s500_DocumentsPrinted = "Documents printed"
    s550_DocumentsSigned = "Documents signed"
    s800_sent = "Sent"

    @classmethod
    def getStatusNumberFromText(cls, statusText) -> int:
        for key, value in cls.statusDict.items():
            if value == statusText:
                return key

