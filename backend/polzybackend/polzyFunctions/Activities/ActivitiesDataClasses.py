from dataclasses import dataclass, field
from datetime import datetime
import json
from logging import getLogger

logger = getLogger("PyC")


class InputFieldTypes:
    # Just a regular string. May have valueRangeInput, then it is a dropdown. Otherwise only text field.
    # If used with FieldType.output it may have HTML in the value and it will be rendered accordingly.
    TYPESTRING = "Text"

    # A checkbox, which is displayed on the top of the current card or sub-card
    TYPEBOOLEAN = "Flag"
    # A date with date-selector
    TYPEDATETIME = "Datum"
    # A number.
    # May have valueRangeInput=["range", <low>, <high>]
    # If a range is given and inputTriggersComplexupdates = True it will fire a backend-event
    #     after the value was entered.
    # May also be combined with "decimals" and an int of decimal places. Default = 0 decimals = Integers only.
    TYPENUMERIC = "Zahl"
    # A search field for Address endpoint. Seems to be old and replaced by SearchEndPoint
    TYPEADDRESS = "Adresse"
    # A field that will trigger an endpoint and return with a dropdown list. The search field will consume a full line.
    TYPESEARCH = "SearchEndPoint"
    # Long text field
    TYPETEXTBOX = "TextBox"
    # A grid display with Headers and Lineitems
    TYPETABLE = "Table"
    # An Image with interactive (mouseover) capabilities. Don't mix that up with icons or logos, etc.
    TYPEIMAGE = "Image"

    # Like the TYPEBOOLEAN but will consume one full line of the display.
    # You can provide "related_fields" with a list of (slightly differntly) formatted DataFields (as DICT).
    # The problem with those fields is, that they get sent in the activity as regular fields and need to be treated
    # specially in the updateFieldValues-implementation of the corresponding class in order for the sent values
    # to find their way back into the related_fields
    # In the attribute "kurztext" (brief) you may provide valid HTML (e.g. used for longer texts
    TYPEFLAGFULLLINE = "FlagWithOptions"

    # Like the TypeFlagFULLINE but as toggle field with 3 possible values: yes/no/none.
    TYPERADIOWITHOPTIONS = "RadioFlagWithOptions"

    # a Chart-display with various options in value (as DICT)
    # <axis.i.name>: <value> <axis.i.unit>
    # data payload should be a list of lists [x, y]:
    # "values": [
    #        [0, 2115584],
    #        [29, 2263761] ]
    # {
    #         "value": {
    #           "axis": {
    #             "x": {
    #               "name": "Days",
    #               "unit": "d"
    #             },
    #             "y": {
    #               "name": "Amount,
    #               "unit": "$"
    #             }
    #           },
    #           "values": [
    #                [0, 2115584],
    #                [29, 2263761],
    #                ...
    #           ]
    #         }
    #       }
    # Important: Use fieldType = FieldTypes.output - everything else will not work!
    TYPECHART = "Chart"

    # Specific component used for documents-card of Backend-Antrags
    # fieldType may only be 2!
    # value is a list dict objects representing document file {
    # "id": <string: file.id>,
    # "name": <string: filename>,
    # "created": <string: date>,
    # "signed": <string> (for instance: "Yes" or "No"),
    # }
    # See also example in Showcase:
    # lines 175+ of https://gogs.earthsquad.global/athos/PoLZy_Showcase/src/master/antrag.py
    TYPEDOCUMENTS = "Documents"

    # fieldType may only be 2!
    # value is a list dict objects representing attached file
    # example in lines 128+ of gogs.earthsquad.global/athos/PoLZy_Showcase/src/master/antrag.py
    # {"id": < string: file.id >,
    # "name": < string: filename >,
    # "created": < string: date >,
    # "type": < string: file.type >,
    # "actions": [ "edit", "delete"] }
    # The supported actions are edit (edit file type) and delete (delete attached document).
    TYPEATTACHMENTS = "Attachments"

    def __init__(self):
        self.types = [
            FieldDataType(typeName=self.TYPESTRING),
            FieldDataType(typeName=self.TYPEBOOLEAN),
            FieldDataType(typeName=self.TYPEDATETIME),
            FieldDataType(typeName=self.TYPENUMERIC),
            FieldDataType(typeName=self.TYPEADDRESS),
            FieldDataType(typeName=self.TYPESEARCH),
            FieldDataType(typeName=self.TYPETEXTBOX),
            FieldDataType(typeName=self.TYPETABLE),
            FieldDataType(typeName=self.TYPEIMAGE),
            FieldDataType(typeName=self.TYPEFLAGFULLLINE),
            FieldDataType(typeName=self.TYPECHART),
            FieldDataType(typeName=self.TYPEDOCUMENTS),
            FieldDataType(typeName=self.TYPEATTACHMENTS),
        ]


@dataclass
class FieldDataType:
    typeName: str

    def toJson(self):
        return self.typeName


@dataclass
class FieldTypes:
    # Visible and ready for Input in Frontend
    visible = 1
    # Visible in Frontend. Output only.
    output = 2
    # this field-type will generally not be transferred to the frontend. It will usually not be printed.
    hidden = 3
    # This field-type will not be visible in Frontend but be transferred anyway
    hiddenFrontend = 4


# POLZY
@dataclass
class FieldDefinition:
    name: str = field(default="")  # POLZY
    value: any = field(default=None)  # POLZY
    valueTech: any = field(default=None)
    valueOutput: any = field(default=None)
    valueRangeInput: list = field(default_factory=list)  # POLZY
    # This value is a single implementation of usually 2 fields (Value, DefaultValue). When the activity get's executed
    # it's not important whether the user chose the default value or manually selected another value, so 1 field is
    # enough. When the backend wants to set a default value, it writes it in this field for the frontend.
    # Before the frontend can execute the activity, it will write the chosen value from the UI into this field.
    fieldDataType: FieldDataType = field(default=FieldDataType)  # Boolean, String, Numeric, etc.
    decimalPlaces: int = field(default=0)
    inputTriggersComplexUpdates: bool = field(default=False)
    kurzbeschreibung: str = field(default="")  # Short description
    tooltip: str = field(default="")
    onlyValuesFromValueRange: bool = field(default=False)
    isMandatory: bool = field(default=False)
    errorMessage: str = field(default="")  # If a value is set, the frontend will show it as helper to the user.
    fieldType: int = field(default=FieldTypes.visible)  # See Class FieldTypes
    icon: str = field(default="")
    group: str = field(default="")
    # If this is True, then the field is a group-field. Must be boolean.
    # Group-Fields are displayed on the top of the card. They activate/
    # deactivate groups of fields = a card within the card.
    isGroupField: bool = field(default=False)
    endpoint: str = field(default="")
    subtitles: list = field(default_factory=list)
    subsection: str = field(default="")
    background: str = field(default="")
    relatedFields: list = field(default_factory=list)

    @classmethod
    def stringify(cls, value):
        #
        # stringifies value
        #

        # datetime
        if isinstance(value, datetime):
            return value.strftime("%d-%m-%Y")

        # list or dictionary
        if isinstance(value, (list, dict)):
            return value

        if value is None:
            return value

        # other cases
        return str(value)

    def toJSON(self):

        if hasattr(self, "valueRangeInput") and self.valueRangeInput:
            inputRangeList = [self.stringify(v) for v in self.valueRangeInput]
        else:
            inputRangeList = []

        lValue = self.stringify(self.value)

        # boolean fields with "output" don't work on the frontend. change them to "string" and use valueOutput
        lFieldDataType = self.fieldDataType
        if lFieldDataType == FieldDataType(InputFieldTypes.TYPEBOOLEAN) and self.fieldType == FieldTypes.output:
            lFieldDataType = FieldDataType(InputFieldTypes.TYPESTRING)
            lValue = self.stringify(self.valueOutput)

        try:
            lReturn = {
                'fieldType': self.fieldType,
                'name': self.name,
                'brief': self.kurzbeschreibung,
                'tooltip': self.tooltip,
                'icon': self.icon,
                'fieldDataType': lFieldDataType.toJson(),
                'inputRange': inputRangeList,
                'onlyFromRange': self.onlyValuesFromValueRange,
                'value': lValue,
                'inputTriggers': self.inputTriggersComplexUpdates,
                'isMandatory': self.isMandatory,
                'errorMessage': self.errorMessage,
                'endpoint': self.endpoint,
                'subtitles': self.subtitles,
                'subsection': self.subsection,
                'backgroundColor': self.background,
                'relatedFields': json.loads(json.dumps(
                    self.relatedFields, default=lambda o: o.toJson() if isinstance(o, FieldDataType) else o)
                ),  # converting FieldDataType object to string, just to avoid errors in json.dumps
            }

            # Remove all empty field values to save space for talking to the frontend
            return {k: v for k, v in lReturn.items() if not self.__checkIfEmptyValue(v)}

        except Exception as e:
            logger.critical(f"Fehler {e}")
            raise ValueError(f"Fehler in toJSON: {e}")

    @staticmethod
    def __checkIfEmptyValue(inValue) -> bool:  # Will return true if empty, flase if not empty.
        if not inValue:
            return True
        if isinstance(inValue, str):
            if len(inValue.strip()) > 0:
                return False
            return True
        if isinstance(inValue, (int, float)):
            return False
        if isinstance(inValue, (list, dict)):
            return len(inValue) == 0
        if isinstance(inValue, FieldTypes):
            return False

        logger.info(f"not sure how to handle this field value {inValue}, it's type {type(inValue)}. Will parse to FE")
        return True


class InputFields:
    def __init__(self):
        self.fields: [FieldDefinition] = []

    def addField(self, inputField: FieldDefinition):
        self.fields.append(inputField)

    def getAllInputFields(self) -> [FieldDefinition]:
        return self.fields

    def getAllFieldGroups(self) -> [FieldDefinition]:
        return list(filter(lambda field: field.isGroupField, self.fields))

    def __len__(self):
        return len(self.fields)

    def toJSON(self):
        if not hasattr(self, "fields") or not self.fields:
            return []
        outputList = [f.toJSON() for f in self.fields]
        return outputList

    def getField(self, **kwargs) -> FieldDefinition:
        # returns InputField object matching with given parameters.
        for item in self.fields:
            success = True
            for key, value in kwargs.items():
                try:
                    original_value = getattr(item, key)
                except Exception:
                    original_value = ""
                if original_value != value:
                    success = False
                    break
            if success:
                return item
        return None

    def setField(self, fieldDefinition: FieldDefinition):
        for item in self.fields:
            if item.name == fieldDefinition.name:
                item.fieldType = fieldDefinition.fieldType
                item.kurzbeschreibung = fieldDefinition.kurzbeschreibung
                item.isMandatory = fieldDefinition.isMandatory
                item.feldArt = fieldDefinition.fieldDataType
                item.value = fieldDefinition.value
                item.valueTech = fieldDefinition.valueTech
                item.onlyValuesFromValueRange = fieldDefinition.onlyValuesFromValueRange
                item.inputTriggersComplexUpdates = fieldDefinition.inputTriggersComplexUpdates
                item.valueRange = fieldDefinition.valueRangeInput
                item.tooltip = fieldDefinition.tooltip
        # Looks like a new item!
        self.addField(inputField=fieldDefinition)
