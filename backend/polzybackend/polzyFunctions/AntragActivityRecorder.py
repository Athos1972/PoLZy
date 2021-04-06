#import json
from fasifu.GlobalConstants import logger
from polzybackend.models import AntragActivityRecords


def recordAntragDecorator(method):
    def wrapper(self, *args, **kwargs):
        result = method(self, *args, **kwargs)
        activityWriter(self)
        return result
    return wrapper


def activityWriter(inInstance):
    from fasifu.Dataclasses.Antrag import Antrag
    """The usage of "Antrag" here is wrong, usually it's an AntragActivitiy that will be provided in the call.
    It is anyway important to have this reference because otherwise the "where used" doesn't work for "setSearchString"

    """
    lInstance = None
    try:
        lInstance = inInstance.antrag
    except AttributeError:
        pass

    if not lInstance:
        # this will work if the instance itself is an Antrag (happens so far only when the Tag is changed by
        # frontend
        lInstance:Antrag = inInstance

    logger.debug(f"classname = {lInstance.__class__.__name__}")
    # Update search string in this antrag instance. It is the main search criteria.
    try:
        lInstance.setSearchString()
    except AttributeError:
        logger.critical(f"We have instance of Type {type(inInstance)}. We can't currently work with that.")
        return

    record = AntragActivityRecords.new(lInstance)
    '''
    ## the assignment could be performed in 'new' method
        antrag_id=str(instance.id),
        user_id=str(instance.user.id),
        company_id=str(instance.user.company_id),
        antragsnummer=instance.antragsnummer,
        status=instance.status,
        searchString=instance.searchstring,
        json_data=json.dumps(instance.Fields.toJSON()),
        class_name=instance.__class__.__name__,
        sapClient=instance.sapClient,
    )
    '''
    logger.debug(f"Activity recorded with id: {record.id}")
