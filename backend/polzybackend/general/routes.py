from flask import jsonify, request, current_app
from polzybackend.general import bp
from polzybackend.utils.import_utils import all_stages
from polzybackend import auth


@bp.route('/stages')
def stages():
    #
    # returns list of all available stages for login
    #

    try:
        # get all stages
        stages = all_stages()()
        current_app.logger.debug(f"Value of stages: {stages}")

    except Exception as e:
        current_app.logger.warning(f'Failed to get All Stages: {e}')
        stages = []

    return jsonify(stages), 200


@bp.route('/values', methods=['POST'])
@auth.login_required
def values():
    #
    # returns value list
    #

    # get post data
    data = request.get_json()

    # app store options
    app_store = {
        'policy': 'POLICIES',
        'antrag': 'ANTRAGS',
    }

    try:
        # get parent instance from app store
        store_key = app_store.get(data['typeOfInstance'])
        if store_key is None:
            raise Exception(f'Type of instance not found in PoLZy: {data["typeOfInstance"]}')

        instance = current_app.config[store_key].get(data['id'])
        if instance is None:
            raise Exception(f'Instance of {data["typeOfInstance"]} with id {data["id"]} not found in PoLZy storage. Most probably app restarted.')

        # get value list
        result = instance.get_values(data.get('valueListName'))
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.exception(f'Faild to get value-list for paylod {data}\n{e}')
    
    return jsonify({'error': f'Failed to get value-list'}), 400

