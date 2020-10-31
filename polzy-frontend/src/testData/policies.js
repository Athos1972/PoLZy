
export const policies = [
  {
    status: "waiting",
    number: "WT-12345",
    date: "2020-07-07",
  },
  {
    status: "failed",
    number: "FL-12345",
    date: "2020-09-09",
    error: "Invalid Policy",
  },
  {
    status: "ok",
    number: "OK-12345",
    date: "2020-10-10",
    policy: {
      number: "OK-12345",
      effective_date: "2020-10-10",
      product_line: {
        name: "P&C",
        attributes: {
          PnCAttribute1: "fridge",
          PnCAttribute2: "tea pot"
        }
      },
      remote_system: "PoLZy",
      status: "active",
      premium_payer: {
        is_person: true,
        first_name: "Sander",
        last_name: "Thomsen",
        birthdate: "1998-03-29",
        address: "2563 Knudsvej",
        city: "St.Merl\u00f8se",
        country: "Denmark",
        postal_code: "99357",
        email: "sander.thomsen@example.com",
        primary_phone: "99806574",
        secondary_phone: "83449057",
        occupation: "architect",
        occupation_from: "2015-01-12",
        previous_occupation: "excavating operator",
        sports: [],
        health_condition: "Good"
      },
      insured_object: {
        is_person: false,
        type: "Forest",
        attributes: {
          ForestAttribute1: "trash bag"
        },
        implementation_attributes: {
          ImplementationAttribute1: "novel",
          ImplementationAttribute2: "credit card"
        }
      },
      attributes: {
        PolicyAttribute1: "class ring",
        PolicyAttribute2: "bouquet of flowers",
        PolicyAttribute3: "toy soldier",
        PolicyAttribute4: "sharpie"
      }
    },
    possible_activities: [
      "cancel",
      "suspend"
    ],
    attributes: {
      policy: {
        PolicyAttribute1: "Description of Policy Attribute 1",
        PolicyAttribute2: "Description of Policy Attribute 2",
        PolicyAttribute3: "Description of Policy Attribute 3",
        PolicyAttribute4: "Description of Policy Attribute 4"
      },
      product_line: {
        PnCAttribute1: "Description of P&C Attribute 1",
        PnCAttribute2: "Description of P&C Attribute 2"
      },
      insured_object: {
        InsuredObjectAttribute1: "Description of Insured Object Attribute 1",
        InsuredObjectAttribute2: "Description of Insured Object Attribute 2",
        InsuredObjectAttribute3: "Description of Insured Object Attribute 3"
      },
      insured_object_type: {
        ForestAttribute1: "Description of Forest Attribute 1"
      },
      implementation: {
        ImplementationAttribute1: "Description of Implementation Attribute 1",
        ImplementationAttribute2: "Description of Implementation Attribute 2"
      }
    }
  },
  {
    status: "ok",
    number: "XL-00052",
    date: "2021-04-05",
    "policy": {
      "number": "XL-00052",
      "effective_date": "2021-04-05",
      "product_line": {
        "name": "Car",
        "attributes": {
          "Car Attribute 1": "ipod charger"
        }
      },
      "remote_system": "PoLZy",
      "status": "suspended",
      "premium_payer": {
        "is_person": false,
        "company_name": "Aramark Holdings Corporation",
        "address": "1434 Parkv\u00e6nget",
        "city": "Stokkemarke",
        "country": "Denmark",
        "postal_code": "55738",
        "email": "william.olsen@example.com",
        "primary_phone": "46895070",
        "secondary_phone": "48859069"
      },
      "insured_object": {
        "is_person": false,
        "type": "Factory",
        "attributes": {
          "Factory Attribute 1": "statuette",
          "Factory Attribute 2": "feather",
          "Factory Attribute 3": "plush pony"
        },
        "implementation_attributes": {
          "Implementation Attribute 1": "mp3 player",
          "Implementation Attribute 2": "desk"
        }
      },
      "attributes": {
        "Policy Attribute 1": "toy boat",
        "Policy Attribute 2": "twister",
        "Policy Attribute 3": "sandglass",
        "Policy Attribute 4": "rubber stamp"
      }
    },
    "possible_activities": [
      "cancel",
      "re-activate"
    ],
    "attributes": {
      "policy": {
        "Policy Attribute 1": "Description of Policy Attribute 1",
        "Policy Attribute 2": "Description of Policy Attribute 2",
        "Policy Attribute 3": "Description of Policy Attribute 3",
        "Policy Attribute 4": "Description of Policy Attribute 4"
      },
      "product_line": {
        "Car Attribute 1": "Description of Car Attribute 1"
      },
      "insured_object": {
        "Insured Object Attribute 1": "Description of Insured Object Attribute 1",
        "Insured Object Attribute 2": "Description of Insured Object Attribute 2",
        "Insured Object Attribute 3": "Description of Insured Object Attribute 3"
      },
      "insured_object_type": {
        "Factory Attribute 1": "Description of Factory Attribute 1",
        "Factory Attribute 2": "Description of Factory Attribute 2",
        "Factory Attribute 3": "Description of Factory Attribute 3"
      },
      "implementation": {
        "Implementation Attribute 1": "Description of Implementation Attribute 1",
        "Implementation Attribute 2": "Description of Implementation Attribute 2"
      }
    }
  },
  {
    status: "ok",
    number: "RA-25045",
    date: "2020-12-07",
    "policy": {
      "number": "RA-25045",
      "effective_date": "2020-12-07",
      "product_line": {
        "name": "Life",
        "attributes": {
          "Life Attribute 1": "grocery list",
          "Life Attribute 2": "spool of wire",
          "Life Attribute 3": "bottle of honey"
        }
      },
      "remote_system": "PoLZy",
      "status": "canceled",
      "premium_payer": {
        "is_person": true,
        "first_name": "Viivi",
        "last_name": "Polon",
        "birthdate": "1995-02-07",
        "address": "8089 Pispalan Valtatie",
        "city": "Polvij\u00e4rvi",
        "country": "Finland",
        "postal_code": "96264",
        "email": "viivi.polon@example.com",
        "primary_phone": "06-568-635",
        "secondary_phone": "043-246-06-06",
        "occupation": "medical equipment preparer",
        "occupation_from": "2011-09-03",
        "previous_occupation": "database administrator",
        "sports": [
          "Acro sports",
          "Marathon"
        ],
        "health_condition": "Bad"
      },
      "insured_object": {
        "is_person": true,
        "partner": {
          "is_person": true,
          "first_name": "Tiago",
          "last_name": "Charles",
          "birthdate": "1960-07-30",
          "address": "863 Rue Saint-Georges",
          "city": "Argenteuil",
          "country": "France",
          "postal_code": "58651",
          "email": "tiago.charles@example.com",
          "primary_phone": "03-93-77-48-42",
          "secondary_phone": "06-30-80-10-21",
          "occupation": "dietitian",
          "occupation_from": "2006-11-10",
          "previous_occupation": "farm advisor",
          "sports": [
            "Silambam"
          ],
          "health_condition": "Bad"
        },
        "attributes": {
          "Insured Person Attribute 1": "chalk",
          "Insured Person Attribute 2": "zebra",
          "Insured Person Attribute 3": "hair clip"
        },
        "implementation_attributes": {
          "Implementation Attribute 1": "multitool",
          "Implementation Attribute 2": "spool of thread"
        }
      },
      "attributes": {
        "Policy Attribute 1": "grid paper",
        "Policy Attribute 2": "sand paper",
        "Policy Attribute 3": "box",
        "Policy Attribute 4": "computer"
      }
    },
    "possible_activities": [],
    "attributes": {
      "policy": {
        "Policy Attribute 1": "Description of Policy Attribute 1",
        "Policy Attribute 2": "Description of Policy Attribute 2",
        "Policy Attribute 3": "Description of Policy Attribute 3",
        "Policy Attribute 4": "Description of Policy Attribute 4"
      },
      "product_line": {
        "Life Attribute 1": "Description of Life Attribute 1",
        "Life Attribute 2": "Description of Life Attribute 2",
        "Life Attribute 3": "Description of Life Attribute 3"
      },
      "insured_object": {
        "Insured Object Attribute 1": "Description of Insured Object Attribute 1",
        "Insured Object Attribute 2": "Description of Insured Object Attribute 2",
        "Insured Object Attribute 3": "Description of Insured Object Attribute 3"
      },
      "insured_object_type": null,
      "implementation": {
        "Implementation Attribute 1": "Description of Implementation Attribute 1",
        "Implementation Attribute 2": "Description of Implementation Attribute 2"
      }
    }
  },
]