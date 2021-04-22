

class Parser:
    def __init__(self, address):
        self.address = address
        self.postcode = None
        self.street = None
        self.streetNumber = None
        self.houseNumber = None
        self.process_address()

    def process_address(self):
        self.postcode = self.address.split()[0]
        self.street = self.address.split()[1]
        self.streetNumber = self.address.split()[2].split("/")[0]
        self.houseNumber = self.address.split()[2].split("/")[1]

    def to_dict(self):
        dic = dict()
        if self.postcode:
            dic["postCode"] = self.postcode
        if self.street:
            dic["street"] = self.street
        if self.streetNumber:
            dic["streetNumber"] = self.streetNumber
        if self.houseNumber:
            dic["houseNumber"] = self.houseNumber
        return dic
