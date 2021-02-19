from flask import jsonify, request, current_app, send_file, abort
from polzybackend.antrag import bp
from polzybackend.utils.import_utils import antrag_products, antrag_class
from polzybackend import auth
from polzybackend.models import AntragActivityRecords
from polzybackend.utils.import_utils import import_class
import json

@bp.route('/antrag/products')
@auth.login_required
def get_antrag_products():
    #
    # returns all products that available for current user
    #
    try:
        # get all stages
        product_list = antrag_products().getAllAvailableProducts(auth.current_user())
        return jsonify(product_list), 200

    except Exception as e:
        current_app.logger.exception(f"Error during get_antrag_products: {e}")
        
    return jsonify({'error': f'Failed to get antrag products'}), 400


@bp.route('/antrag/new/<string:product_type>')
@auth.login_required
def new_antrag(product_type):
    #
    # creates an Antrag by product_type
    # and returns it to frontend
    #
    try:
        antrag = antrag_class()(product_type, auth.current_user())

        # store antrag and return it to store and return json object
        antrag.initialize()
        current_app.config['ANTRAGS'][antrag.id] = antrag
        result = antrag.get()
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.exception(f'Initialization of antrag instance {product_type} failed: {e}')

    return jsonify({'error': f'Initialization of antrag instance failed'}), 400


@bp.route('/antrag/clone/<string:id>')
@auth.login_required
def clone_antrag(id):
    #
    # clone antrag instance by id
    #

    try:
        # get antrag from app store
        antrag_src = current_app.config['ANTRAGS'].get(id)
        if antrag_src is None:
            raise Exception(f'Antrag {id} not found')

        # make copy and return antrag json object
        antrag = antrag_src.clone()
        current_app.config['ANTRAGS'][antrag.id] = antrag
        result = antrag.get()
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.warning(f'Cloning of antrag {id} failed: {e}')
    
    return jsonify({'error': f'Cloning of antrag instance failed'}), 400


@bp.route('/antrag/update', methods=['POST'])
@auth.login_required
def update_antrag():
    #
    # updates antrag fields
    #

    # get post data
    data = request.get_json()

    # get antrag and update its values
    try:
        # get antrag from app store
        antrag = current_app.config['ANTRAGS'].get(data['id'])
        if antrag is None:
            raise Exception(f'Antrag {data["id"]} is absent in PoLZy storage. Most probably instance restarted.')

        # update antrag values and return antrag json object
        antrag.updateFields(data)
        result = antrag.get()
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.exception(f'Antrag {data["id"]}, fields update failed: {e}')
    
    return jsonify({'error': f'Update of the antrag fields failed'}), 400


@bp.route('/antrag/execute', methods=['POST'])
@auth.login_required
def execute_antrag():
    #
    # executes antrag activities
    #

    # get post data
    data = request.get_json()

    # get antrag and execute activity
    try:
        # get antrag from app store
        antrag = current_app.config['ANTRAGS'].get(data['id'])
        if antrag is None:
            raise Exception(f'Antrag {data["id"]} is absent in PoLZy storage. Most probably instance restarted.')

        # execute antrag activity and return the response object
        result = antrag.executeActivity(data)
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.exception(f'Failed execute activity {data.get("activity")} of antrag {data["id"]}: {e}')
    
    return jsonify({'error': f'Execution of antrag activiy {data.get("activity")} failed'}), 400


@bp.route('/antrag/records/searchString', methods=['POST'])
@auth.login_required
def getSearchStringFromRecords():
    data = request.get_json()

    # supplying current user to get records of current user & company
    results = AntragActivityRecords.getSearchString(auth.current_user(), data.get("searchString"))
    return jsonify(results.to_dict), 200


@bp.route('/antrag/records/load', methods=['GET'])
@auth.login_required
def loadLatestRecords():
    data = request.get_json()
    result = AntragActivityRecords.getLatest(data.get("antrag_id") or data.get("id"))  # flexible to get from both ids
    class_ = import_class(current_app.config.get('DATACLASSES') + (f".{result.class_name}" * 2))
    instance = class_(auth.current_user(), result.sapClient)  # creating class instance of Antrag

    # creating dictionary with name as key and value as value of inputField. These are used to load fields.
    dic = {js.get("name"): js.get("valueChosenOrEntered") for js in json.loads(instance.json_data)}
    instance.valueChosenOrEntered(dic)  # loading above created dic to instance
    return jsonify(result.to_dict), 200
