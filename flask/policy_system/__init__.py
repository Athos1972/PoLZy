#
# emulator of a Policy Management System
#
import json
from time import sleep

DELAY_SECONDS = 1
POLICY_DATASET = 'policy_system/data/policies.json'

def get(policy_number, effective_date):
    #
    # returns policy from dataset
    #

    # load policies
    with open(POLICY_DATASET, 'r') as f:
        policies = json.load(f)
        # delay emulation
        sleep(DELAY_SECONDS)
        for item in policies:
            if policy_number.upper() == item['number'].upper() and effective_date == item['effective_date']:
                return item