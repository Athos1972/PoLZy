from datetime import datetime
import json

#
# Policy details classes
#

path_to_policies = 'app/data/policies.json'

def get_date(date_string):
    if date_string is None:
        return None
    return datetime.strptime(date_string, '%Y-%m-%d')

def get_data(path=path_to_policies):
    with open(path, 'r') as f:
        return json.load(f)


class Policy:
    def __init__(self, number, date):
        self.number = number
        self.effective_date = date
        self.data = None

    def fetch(self):
        data = get_data()
        for item in data:
            if self.number == item['number'] and self.effective_date == item['effective_date']:
                self.data = item


class Partner:
    def __init__(self, data):
        self.is_person = data.get('is_person')
        if self.is_person:
            self.first_name = data.get('first_name')
            self.last_name = data.get('last_name')
            self.middle_name = data.get('middle_name')
            self.birthdate = get_date(data.get('birthdate'))
            self.occupation = get_date(data.get('occupation'))
            self.occupation_from = get_date(data.get('occupation_from'))
            self.prev_occupation = data.get('previous_occupation')
            self.sports = data.get('sports')
            self.health_condition = data.get('health_condition')
        else:
            self.company_name = data.get('company_name')
        self.addres = data.get('address')
        self.city = data.get('city')
        self.country = data.get('country')
        self.postal_code = data.get('postal_code')
        self.primary_email = data.get('primary_email')
        self.secondary_email = data.get('secondary_email')
        self.primary_phone = data.get('primary_phone')
        self.secondary_phone = data.get('secondary_phone')


class InsuredObject:
    def __init__(self, data):
        self.is_person = data.get('is_person')
        if self.is_person:
            self.person = Partner(data)
        else:
            self.type = data.get('type')
            
