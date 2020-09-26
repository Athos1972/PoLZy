import requests
import json
from random import choice, randrange, sample
from string import ascii_uppercase, digits
from datetime import date, timedelta

RECORD_NUMBER = 50


def generate_persons(number):
    print('\nGenerating persons...')
    user_url = f'https://randomuser.me/api/?results={number}&nat=ch,de,dk,es,fi,fr,gb,ie,nl,no,tr'
    occupation_url = 'https://raw.githubusercontent.com/dariusk/corpora/master/data/humans/occupations.json'
    sports_url = 'https://raw.githubusercontent.com/dariusk/corpora/master/data/sports/sports.json'

    # get occupations
    print('Fetching occupations...')
    r = requests.get(occupation_url)
    if r.status_code != 200:
        print(f'Occupations Response: {r.status_code}\n{r.text}')
        return
    occupations = r.json().get('occupations')

    # get sports
    print('Fetching sports...')
    r = requests.get(sports_url)
    if r.status_code != 200:
        print(f'Sports Response: {r.status_code}\n{r.text}')
        return
    sports = r.json().get('sports')

    # get users
    print('Fetching users...')
    r = requests.get(user_url)
    if r.status_code != 200:
        print(f'Users Response: {r.status_code}\n{r.text}')
        return
    users = r.json().get('results')

    # health conditions
    health_conditions = ['Good', 'Normal', 'Bad']

    # generate persons
    persons = []
    for user in users:
        persons.append(
            {
                'first_name': user['name'].get('first'),
                'last_name': user['name'].get('last'),
                'birthdate': user['dob'].get('date')[:10],
                'address': ' '.join(map(str, user['location'].get('street').values())),
                'city': user['location'].get('city'),
                'country': user['location'].get('country'),
                'postal_code': user['location'].get('postcode'),
                'email': user['email'],
                'primary_phone': user['phone'],
                'secondary_phone': user['cell'],
                'occupation': choice(occupations),
                'occupation_from': user['registered'].get('date')[:10],
                'previous_occupation': choice(occupations),
                'sports': [choice(sports) for i in range(randrange(3))],
                'health_condition': choice(health_conditions),
            }
        )

    return persons

def generate_companies(number):
    print('\nGenerating companies...')
    user_url = f'https://randomuser.me/api/?results={number}'
    fortune_url = 'https://raw.githubusercontent.com/dariusk/corpora/master/data/corporations/fortune500.json'

    # get companies
    print('Fetching comapy names...')
    r = requests.get(fortune_url)
    if r.status_code != 200:
        print(f'Companies Response: {r.status_code}\n{r.text}')
        return
    companies = sample(r.json().get('companies'), number)

    # get users
    print('Fetching users...')
    r = requests.get(user_url)
    if r.status_code != 200:
        print(f'Users Response: {r.status_code}\n{r.text}')
        return
    users = r.json().get('results')

    # generate companies
    partners = []
    for user, company in zip(users, companies):
        partners.append(
            {
                'is_person': False,
                'company_name': company,
                'address': ' '.join(map(str, user['location'].get('street').values())),
                'city': user['location'].get('city'),
                'country': user['location'].get('country'),
                'postal_code': user['location'].get('postcode'),
                'email': user['email'],
                'primary_phone': user['phone'],
                'secondary_phone': user['cell'],
            }
        )

    return partners

def generate_insured_object(person=None):
    if person:
        return {
            'is_person': True,
            'partner': person,
        }

    object_types = [
        'House',
        'Car',
        'Factory',
        'Field',
        'Forest',
    ]
    return {
        'is_person': False,
        'type': choice(object_types),
    }

def generate_policies(number):
    persons = generate_persons(number)
    partners = persons + generate_companies(number)

    statuses = [
        'active',
        'canceled',
        'suspended',
    ]

    product_lines = {
        'Life': True,
        'Health': True,
        'P&C': False,
        'Car': False,
    }

    policies = []
    for i in range(number):
        policy_number = '-'.join((
            ''.join(choice(ascii_uppercase) for _ in range(2)),
            ''.join(choice(digits) for _ in range(5)),
        ))
        effective_date = date.today() + timedelta(days=randrange(360))
        product_line = choice(list(product_lines))
        if product_lines[product_line]:
            insured_object = generate_insured_object(person=choice(persons))
        else:
            insured_object = generate_insured_object()
        policies.append(
            {
                'number': policy_number,
                'effective_date': str(effective_date),
                'product_line': product_line,
                'remote_system': 'PoLZy',
                'status': choice(statuses),
                'premium_payer': choice(partners),
                'insured_object': insured_object,
            }
        )

    return policies


if __name__ == '__main__':
    policies = generate_policies(RECORD_NUMBER)
    with open('policies.json', 'w') as f:
        json.dump(policies, f)
