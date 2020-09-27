from datetime import datetime
from app import attributes

# Policy Management System emulator
import policy_system

#
# Policy details 
#

class Policy:
    # setting possible activities depending on Policy status
    activities_by_status = {
        'active': [
            'cancel',
            'suspend',
        ],
        'canceled': [],
        'suspended': [
            're-activate'
        ],
    }

    def __init__(self, number, date):
        #
        # initialization
        #

        self.number = number
        self.effective_date = date
        self.data = None
        self.status = None

    def fetch(self):
        #
        # fetch Policy from Policy Management System
        #

        item = policy_system.get(self.number, self.effective_date)
        if item:
            self.data = item
            self.status = item.get('status')
            return True
        
        # policy not found
        return False

    def get(self):
        #
        # returns Policy data
        #

        if self.data:
            # insured object attributes
            object_attributes = None
            type_attributes = None
            if self.data['insured_object'].get('is_person') is True:
                object_attributes = attributes.insured_person
            elif self.data['insured_object'].get('is_person') is False:
                object_attributes = attributes.insured_object
                type_attributes = attributes.insured_object_type.get(self.data['insured_object'].get('type'))

            return {
                'policy': self.data,
                'attributes': {
                    'policy': attributes.policy,
                    'product_line': attributes.product_line.get(self.data['product_line'].get('name')),
                    'insured_object': object_attributes,
                    'insured_object_type': type_attributes,
                },
                'possible_activities': self.activities_by_status.get(self.status),
            }


'''
def get_date(date_string):
    if date_string is None:
        return None
    return datetime.strptime(date_string, '%Y-%m-%d')

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
'''            
