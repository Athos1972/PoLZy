from polzybackend.mediators import Antrag
from polzyFunctions.Dataclasses.Antrag import Antrag as AntragBase
from polzyFunctions.Activities import AntragActivity
from polzyFunctions.Activities.Activity import Activity
from polzyFunctions.GlobalConstants import GlobalConstants, logger
from flask import current_app, url_for


class VIGAntrag(Antrag):
    #
    # local implementation of PoLZy antrag class
    #

    def initialize(self):
        #
        # initializes antrag instance
        #
        # get antrag object based on product_name

        self.instance = AntragBase(self.user)
        self.id = str(self.instance.id)

    def load(self, client):  # client is supplied as routes can supply it to some inherited version. So to avoid error
        try:
            self.instance = AntragBase(self.user)
        except Exception as e:
            current_app.logger.exception(f"Load of antrag instance failed: {e}")
            raise ValueError("Load of antrag instance failed")

    def __str__(self):
        return f'<Antrag {self.id}: {self.product_name}>'

    def get(self):
        #
        # returns antrag instance as json object to front-end 
        #

        result = self.instance.parseToFrontend()
        return result

    def clone(self):
        #
        # returns a deepcopy of the current instance with updated props
        #

        antrag_copy = super().clone()
        antrag_copy.instance.updateAfterClone()
        antrag_copy.id = str(antrag_copy.instance.id)

        return antrag_copy

    def updateFields(self, data):
        #
        # updates antrag fields based on data
        # If data.get('activity') is None, than the data of the Antragsinstance needs to be updated with new
        # field values.
        #
        # If data.get("activity") is set, then we need to update into an activity.
        # 16.3.21: This works well.

        if data.get('activity') is None:
            self.instance.updateFieldValues(data.get('values'))
        else:
            # get activity class
            activity_class = AntragActivity
            if activity_class is None:
                raise ValueError(f'Unknown activity: {data["activity"]}')

            # update activity values for the activity-instance inside Antrag
            activity = self.instance.get_activity(activity_class.__name__)
            if activity:
                activity[0].updateFieldValues(data.get('values'))

    def findActivity(self, activity_name):
        try:
            target_activity = AntragActivity
            lActivity = next(filter(lambda x: isinstance(x, target_activity), self.instance.Activities), None)
        except TypeError:
            logger.exception(f"Didn't find anything useful for activity {activity_name}. If it's a new activity, then"
                             f" make sure you imported it in antrag.py and added it to activity_classes on the top. ")
            return None

        logger.debug(f"Found existing activity inside Antrag: {lActivity.__class__.__name__}")
        return lActivity

    def executeActivity(self, data):
        #
        # executes antrag activity defined in data
        #
        # update values of Antragsinstance for Frontend display after the activity was executed.
        #
        # We have a long list of IF-conditions because many activities have different return parameters.

        current_activity = self.findActivity(data['activity'])
        if not current_activity:
            print(f"Activity couldn't be found. Something weird going on. data from Frontend: {data}")
            current_app.logger.critical(f"Activity couldn't be found. Something weird going on. data from Frontend: {data}")

        if data['activity'] == 'Berechnen':               # calculate
            # In Berechnen we get the data for the antrag, so we must provide it to Antags-Instance
            self.instance.updateFieldValues(data.get('values'))
            current_activity.executeActivity()
            self.instance.fillCurrentlyPossibleActivities()
            return self.get()

        current_activity.updateFieldValues(data.get('values'))
        lResult = current_activity.executeActivity()

        if data["activity"] in ["Eurotax Vollsuche", "Empfehlung!", "Dokumente", 'Antrag erzeugen PM+']:
            self.instance.fillCurrentlyPossibleActivities()
            return self.get()

        if data['activity'] == 'Drucken':               # print
            if not lResult:
                raise ValueError('Unable to create PDF')
            return {
                "link": url_for(
                    'support.downloads',
                    filename=current_activity.getFolderAndPath(),
                    _external=True,
                ),
            }
        elif data['activity'] == 'Antrag erzeugen':       # save to VNG
            return {
                "link": current_activity.getLinkOfRealApplication()
            }

        elif data['activity'] == "Deckungsuebersicht":
            return {
                "link": url_for(
                    'support.downloads',
                    filename=current_activity.getFolderAndPath(),
                    _external=True,
                ),
            }

        elif data['activity'] == "VN festlegen":
            # Update VN-Fields inside the antrags instance with the latest values.
            self.instance.updateFieldValues(data.get('values'))
            current_activity.setStatusOfAntragAfterPartnerAssignment()

            self.instance.fillCurrentlyPossibleActivities()
            return self.get()

        elif data["activity"] in ["Partner festlegen", "Antragsfragen BUFT"]:
            if lResult:
                self.instance.fillCurrentlyPossibleActivities()
            else:
                # Execution of activity was not successful, activity should stay open
                current_activity.postExecuteBehavior = Activity.POSTEXECUTION_ACTIVE
            return self.get()

        else:
            logger.exception(f'Activity was {data.get("activity")}. No logic implemented for that')
            raise ValueError(f'Antrag activiy {data.get("activity")} failed')

    def getValueList(self, listName):
        if listName == "firmenArten":
            return sorted(["GmbH", "GmbH&Co KG", "AG", "ArGE", "Einz.Unt", "EWIV", "Gen", "GenbR", "E.U", "KEG",
                           "KG", "OEG", "OG", "OHG", "OPG", "PsT", "Sparkasse", "Verein", "VVaG", "WEG"])
            
        lReasult = self.instance.getValueList(listName)
        return lReasult

    def getRemoteDocuments(self, documents_id: list):
        #
        # returns path to fetched remote document 
        #

        path_to_result_document = self.instance.getRemoteDocuments(documents_id)
        return path_to_result_document

    def generateEml(self, documents_id: list):
        # generate eml file with documents as attachments
        path_to_eml = self.instance.generateEml(documents_id)
        return path_to_eml

    def generateAntragEml(self):
        # generate eml file with antrag link
        return self.instance.generateAntragEml()
