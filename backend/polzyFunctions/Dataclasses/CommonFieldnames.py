from enum import Enum

# fixme akash: Please move fields from here to fasifu (marked with "# fasifu"

class CommonFieldnames(Enum):
    policyBeginDate = "Versicherungsbeginn"
    policyEndDate = "Versicherungsende"
    mainDueDate = "Hauptfälligkeit"
    businessCaseType = "GeschäftsfallArt"
    previousPolicyNumber = "Vorpolizzennummer"
    premium = "premium"
    verkaufsAktion = "Aktion"       # fasifu
    paymentFrequency = "Zahlungsfrequenz"
    expertMode = "Erweitern"    # "ExpertenModus"
    AussagenGroup = "Aussagen"     # fasifu
    commissionAccount = "ProvKto"

    bedarfsAnalyse = "BedarfsAnalyse"  # fasifu

    ## Person fields:
    Partner = "Partner"
    partnerName = "partnerName"
    partnerNumber = "partnerNumber"
    birthDate = "birthDate"
    gender = "gender"
    lastName = "lastName"
    firstName = "firstName"

    ## Company fields
    companyName = "companyName"
    companyType = "companyType"
    registrationNumber = "registrationNumber"

    ## Address fields:
    addressDict = "addressDict"
    risikoAdressDict = "Risikoadresse"  # fasifu
    addressID = "addressID"           # official addressID in Backend-System
    addressNumber = "addressNumber"   # Polzy-Internal, temporary addressNumber
    country = "country"
    postCode = "postCode"
    city = "city"
    street = "street"
    streetNumber = "streetNumber"
    houseNumber = "houseNumber"
    telefon = "telefon"
    email = "email"
    pac = "pac"                # fasifu # Austrian specific code for address data
    haushaltID = "haushaltId"  # fasifu # Austian specific code for a "container" for a community, e.g. a flat of a family

    # Fields for "Senden-An-Bestand"
    besondereVereinbarungen = "besondereVereinbarungen"   # fasifu
    besondereVereinbarungenFlag = "besondereVereinbarungenFlag" # fasifu
    underWriterWarnings = "AnnahmeTexte"
    releaseInBackend = "releaseInBackend"  # fasifu
    policyNumber = "policyNumber"
    applicationNumber = "applicationNumber"
    sapMessages = "sapMessages"  # fasifu