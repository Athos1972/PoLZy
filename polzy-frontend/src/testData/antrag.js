
export const antrags = [
{
  "request_state": "ok",
  "id": "ae59ae58-50f5-48ed-833e-c69b75fd80bb",
  "number": "testNummer",
  "status": "Neu",
  "product_line": {
    "name": "KFZ",
    "attributes": {
      "Produkt": "Sicher unterwegs"
    }
  },
  "possible_activities": [
    {
      "name": "Berechnen",
      "description": "Schnellrechner f\u00fcr eingegebene Parameter",
      "fields": []
    }
  ],
  "fields": [
    {
      "fieldType": 1,
      "name": "Versicherungsbeginn",
      "brief": "Versicherungsbeginn",
      "tooltip": "Datum des Versicherungsbeginns",
      "fieldDataType": "Datum",
      "inputRange": [],
      "onlyFromRange": false,
      "valueChosenOrEntered": "26.10.2020",
      "valueChosenOrEnteredTech": null,
      "valueChosenOrEnteredOutput": null,
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "Fahrzeugart",
      "brief": "Fahrzeugart",
      "tooltip": "Bitte w\u00e4hle die Fahrzeugart aus",
      "fieldDataType": "Text",
      "inputRange": [
        "PKW",
        "Klein LKW",
        "Gross LKW",
        "Motorrad",
        "Wohnmobil",
        "Anh\u00e4nger",
        "Zugmaschine/Traktor",
        "Wohnmobil ab 3.5",
        "Elektrofahrrad",
        "Kleinmotorrad",
        "Moped",
        "Arbeitsmaschine",
        "Motorkarren",
        "Transportkarren",
        "Sonderfahrzeuge"
      ],
      "onlyFromRange": false,
      "valueChosenOrEntered": "PKW",
      "valueChosenOrEnteredTech": "PKW",
      "valueChosenOrEnteredOutput": "PKW",
      "inputTriggers": true,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "Marke",
      "brief": "Marke",
      "tooltip": "Bitte w\u00e4hlen Sie den Hersteller des Fahrzeugs aus der Liste",
      "fieldDataType": "Text",
      "inputRange": [
        "",
        "Alfa romeo",
        "Aston martin",
        "Audi",
        "Bentley",
        "Bmw",
        "Chevrolet",
        "Chrysler",
        "Citroen",
        "Dacia",
        "Daewoo",
        "Daihatsu",
        "Dodge",
        "Ferrari",
        "Fiat",
        "Ford (brd)",
        "Ford (gb)",
        "Honda",
        "Humer",
        "Hyundai",
        "Jaguar",
        "Jeep",
        "Kia",
        "Lada",
        "Lamborghini",
        "Lancia",
        "Land rover",
        "Lexus",
        "Maserati",
        "Mazda",
        "Mcc  (smart)",
        "Mercedes",
        "Mini",
        "Mitsubishi",
        "Morgan",
        "Nissan",
        "Opel",
        "Peugeot",
        "Porsche",
        "Puch",
        "Puch mercedes",
        "Range rover",
        "Renault",
        "Rover",
        "Saab",
        "Seat",
        "Skoda",
        "Smart",
        "Sonstige",
        "Ssang yong",
        "Steyr puch",
        "Subaru",
        "Suzuki",
        "Tesla",
        "Toyota",
        "Volvo",
        "Vw"
      ],
      "onlyFromRange": false,
      "valueChosenOrEntered": "Sonstige",
      "valueChosenOrEnteredTech": "Sonstige",
      "valueChosenOrEnteredOutput": "Sonstige",
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "AlterFahrzeug",
      "brief": "Alter des Fahrzeugs",
      "tooltip": "Bitte geben Sie das Alter des Fahrzeugs ein",
      "fieldDataType": "Text",
      "inputRange": [
        "Neu",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11-20",
        ">20"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": "Neu",
      "valueChosenOrEnteredTech": "2020-10-26T18:05:35.064285",
      "valueChosenOrEnteredOutput": "Neu",
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "Antriebsart",
      "brief": "Art des Antriebs",
      "tooltip": "Bitte w\u00e4hlen Sie die Art des Antriebs",
      "fieldDataType": "Text",
      "inputRange": [
        "Andere",
        "Benzin mit Kat",
        "Benzin ohne Kat.",
        "Bivalenter Betrieb Benzin oder Methan",
        "Bivalenter Betrieb mit Benzin oder Erdgas",
        "Bivalenter Betrieb mit Benzin oder Fl\u00fcssiggas",
        "Bivalenter Betrieb mit Wasserstoff oder Benzin",
        "Bivalenter Betrieb mit Wasserstoff oder Benzin kombiniert mit Elektromotor",
        "Brennstoffzelle mit Prim\u00e4renergie Benzin",
        "Brennstoffzelle mit Prim\u00e4renergie Ethanol",
        "Brennstoffzelle mit Prim\u00e4renergie Methanol",
        "Brennstoffzelle mit Prim\u00e4renergie Wasserstoff",
        "Diesel mit Kat.",
        "Diesel ohne Kat.",
        "Elektro",
        "Erdgas (NG)",
        "Fl\u00fcssiggas (LPG)",
        "Gas",
        "Kombinierter Betrieb mit Benzin und Elektromotor",
        "Kombinierter Betrieb mit Biogas und Elektromotor",
        "Kombinierter Betrieb mit Diesel und Elektromotor",
        "Kombinierter Betrieb mit Erdgas und Elektromotor",
        "Kombinierter Betrieb mit Vielstoff und Elektromotor",
        "Kombinierter Betrieb mit Wasserstoff und Elektromotor",
        "Methan (Biogas) mit Biogas",
        "Unbekannt",
        "Vielstoff",
        "Wasserstoff",
        "kein Antrieb"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": "Benzin mit Kat",
      "valueChosenOrEnteredTech": "BENZIN_MIT_KAT",
      "valueChosenOrEnteredOutput": "Benzin mit Kat",
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "CO2",
      "brief": "CO2-Wert",
      "tooltip": "Bitte geben sie den CO2-Wert des Fahrzeugs an",
      "fieldDataType": "Zahl",
      "inputRange": [
        "range",
        "0",
        "500"
      ],
      "onlyFromRange": false,
      "valueChosenOrEntered": "",
      "valueChosenOrEnteredTech": "",
      "valueChosenOrEnteredOutput": "",
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "KW",
      "brief": "Kilowatt",
      "tooltip": "Bitte geben sie den KW-Wert des Fahrzeugs an",
      "fieldDataType": "Zahl",
      "inputRange": [
        "range",
        "0",
        "500"
      ],
      "onlyFromRange": false,
      "valueChosenOrEntered": "",
      "valueChosenOrEnteredTech": "",
      "valueChosenOrEnteredOutput": "",
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "AlterZulassungsbesitzer",
      "brief": "Alter Zulassungsbesitzer",
      "tooltip": "Bitte geben Sie das Alter des Zulassungsbesitzers ein",
      "fieldDataType": "Zahl",
      "inputRange": [
        "range",
        "18",
        "80"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": 30,
      "valueChosenOrEnteredTech": 30,
      "valueChosenOrEnteredOutput": 30,
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "fahrenUnter23",
      "brief": "Fahrer unter 23",
      "tooltip": "Fahren mit diesem Fahrzeug auch Lenker, die unter 23 Jahre alt sind?",
      "fieldDataType": "Flag",
      "inputRange": [],
      "onlyFromRange": true,
      "valueChosenOrEntered": true,
      "valueChosenOrEnteredTech": "JA",
      "valueChosenOrEnteredOutput": "Ja",
      "inputTriggers": false,
      "isMandatory": false
    },
    {
      "fieldType": 1,
      "name": "PlzZulassungsbesitzer",
      "brief": "PLZ Zulassungsbesitzer",
      "tooltip": "Postleitzahl der Meldeadresse des Zulassungsbesitzers",
      "fieldDataType": "Zahl",
      "inputRange": [
        "range",
        "1010",
        "9999"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": 1010,
      "valueChosenOrEnteredTech": 1010,
      "valueChosenOrEnteredOutput": 1010,
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "Haftpflicht",
      "brief": "Haftpflicht",
      "tooltip": "Klick, wenn Haftpflicht-Versicherung kalkuliert werden soll",
      "fieldDataType": "Flag",
      "inputRange": [],
      "onlyFromRange": false,
      "valueChosenOrEntered": true,
      "valueChosenOrEnteredTech": "JA",
      "valueChosenOrEnteredOutput": "Ja",
      "inputTriggers": false,
      "isMandatory": false
    },
    {
      "fieldType": 1,
      "name": "Kaskovariante",
      "brief": "Kaskovariante",
      "tooltip": "Auswahl, welche Kasko-Variante gew\u00e4hlt werden soll",
      "fieldDataType": "Text",
      "inputRange": [
        "Keine",
        "Vollkasko teilweiser SBH",
        "Vollkasko genereller SBH",
        "Teilkasko teilweiser SBH",
        "Teilkasko genereller SBH",
        "Parkschaden teilweiser SBH",
        "Parkschaden genereller SBH"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": "Teilkasko teilweiser SBH",
      "valueChosenOrEnteredTech": "Teilkasko teilweiser SBH",
      "valueChosenOrEnteredOutput": "Teilkasko teilweiser SBH",
      "inputTriggers": false,
      "isMandatory": false
    },
    {
      "fieldType": 1,
      "name": "Kasko_SBH",
      "brief": "Selbstbehalt Kasko",
      "tooltip": "Auswahl, welcher SBH gelten soll",
      "fieldDataType": "Zahl",
      "inputRange": [
        "350",
        "650",
        "950"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": 650,
      "valueChosenOrEnteredTech": 650,
      "valueChosenOrEnteredOutput": "Euro 650",
      "inputTriggers": false,
      "isMandatory": false
    },
    {
      "fieldType": 1,
      "name": "IU",
      "brief": "Insassenunfall",
      "tooltip": "Auswahl, ob Lenker- oder Lenker- und Insassenunfall gew\u00fcnscht ist",
      "fieldDataType": "Text",
      "inputRange": [
        "Lenkerunfall",
        "Lenker- und Insassen",
        "Keine"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": "Lenker- und Insassen",
      "valueChosenOrEnteredTech": "Lenker- und Insassen",
      "valueChosenOrEnteredOutput": "Lenker- und Insassen",
      "inputTriggers": false,
      "isMandatory": false
    },
    {
      "fieldType": 2,
      "name": "premium",
      "brief": "Pr\u00e4mie",
      "tooltip": "Indikative Pr\u00e4mie basierend auf den Eingaben",
      "fieldDataType": "Zahl",
      "inputRange": [],
      "onlyFromRange": true,
      "valueChosenOrEntered": "",
      "valueChosenOrEnteredTech": "",
      "valueChosenOrEnteredOutput": "Euro ",
      "inputTriggers": false,
      "isMandatory": false
    }
  ]
},
{
  "request_state": "ok",
  "id": "d9ebbfac-8d59-4505-afa0-e866b3cb4501",
  "number": "testNummer",
  "status": "Berechnet",
  "product_line": {
    "name": "PnC",
    "attributes": {
      "Produkt": "DONAU Privatschutz Rechtsschutz"
    }
  },
  "possible_activities": [
    {
      "name": "Berechnen",
      "description": "Schnellrechner f\u00fcr eingegebene Parameter",
      "fields": []
    },
    {
      "name": "Drucken",
      "description": "\u00dcbersichtsblatt als PDF ausgeben",
      "fields": []
    },
    {
      "name": "VN festlegen",
      "description": "VN suchen oder neu erfassen",
      "fields": []
    }
  ],
  "fields": [
    {
      "fieldType": 1,
      "name": "Versicherungsbeginn",
      "brief": "Versicherungsbeginn",
      "tooltip": "Datum des Versicherungsbeginns",
      "fieldDataType": "Datum",
      "inputRange": [],
      "onlyFromRange": false,
      "valueChosenOrEntered": "26.10.2020",
      "valueChosenOrEnteredTech": null,
      "valueChosenOrEnteredOutput": null,
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "AlterVN",
      "brief": "Alter Versicherungsnehmer",
      "tooltip": "Bitte geben Sie das Alter des VN ein",
      "fieldDataType": "Zahl",
      "inputRange": [
        "range",
        "18",
        "80"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": 30,
      "valueChosenOrEnteredTech": null,
      "valueChosenOrEnteredOutput": null,
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 1,
      "name": "PlzVN",
      "brief": "PLZ Versicherungsnehmer",
      "tooltip": "Postleitzahl der Meldeadresse des Versicherungsnehmers",
      "fieldDataType": "Zahl",
      "inputRange": [
        "range",
        "1010",
        "9999"
      ],
      "onlyFromRange": true,
      "valueChosenOrEntered": 1010,
      "valueChosenOrEnteredTech": null,
      "valueChosenOrEnteredOutput": null,
      "inputTriggers": false,
      "isMandatory": true
    },
    {
      "fieldType": 2,
      "name": "premium",
      "brief": "Pr\u00e4mie",
      "tooltip": "Indikative Pr\u00e4mie basierend auf den Eingaben",
      "fieldDataType": "Zahl",
      "inputRange": [],
      "onlyFromRange": true,
      "valueChosenOrEntered": 160.52,
      "valueChosenOrEnteredTech": 160.52,
      "valueChosenOrEnteredOutput": 160.52,
      "inputTriggers": false,
      "isMandatory": false
    }
  ]
}
]