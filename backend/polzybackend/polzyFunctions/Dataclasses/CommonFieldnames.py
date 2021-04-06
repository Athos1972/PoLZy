from enum import Enum


class CommonFieldnames(Enum):
    versicherungsBeginn = "Versicherungsbeginn"
    versicherungsEnde = "Versicherungsende"
    hauptfaelligkeit = "Hauptfälligkeit"
    premium = "premium"
    verkaufsAktion = "Aktion"
    zahlungsFrequenz = "Zahlungsfrequenz"
    expertenModus = "Erweitern"    # "ExpertenModus"
    AussagenGroup = "Aussagen"
    provisionsKonto = "ProvKto"

    bedarfsAnalyse = "BedarfsAnalyse"

    ## Person fields:
    Partner = "Partner"
    Kundenname = "Kundenname"
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
    risikoAdressDict = "Risikoadresse"
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
    pac = "pac"                # Austrian specific code for address data
    haushaltID = "haushaltId"  # Austian specific code for a "container" for a community, e.g. a flat of a family

    # Fields for "Senden-An-Bestand"
    besondereVereinbarungen = "besondereVereinbarungen"
    besondereVereinbarungenFlag = "besondereVereinbarungenFlag"
    underWriterWarnings = "AnnahmeTexte"
    releaseInBackend = "releaseInBackend"
    policyNumber = "policyNumber"
    applicationNumber = "applicationNumber"
    sapMessages = "sapMessages"