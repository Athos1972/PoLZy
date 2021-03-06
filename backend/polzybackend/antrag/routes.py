from flask import jsonify, request, current_app, send_file, abort
from polzybackend.antrag import bp
from polzybackend.utils.import_utils import antrag_products, antrag_factory
from polzybackend import auth
from polzybackend.models import AntragActivityRecords
from polzybackend.utils.import_utils import import_class
import json
from copy import deepcopy
from polzybackend.utils import zip_response


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
        # load user and its relationships
        user = auth.current_user()
        user.company.company
        # create antrag instance
        antrag = antrag_factory().create(product_type, deepcopy(user))

        # store antrag to app and return as json object
        current_app.config['ANTRAGS'][antrag.uuid] = antrag
        result = antrag.parseToFrontend()
        #return jsonify(result), 200

        response = zip_response(result)
        return response, 200

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
        current_app.config['ANTRAGS'][antrag.uuid] = antrag
        result = antrag.parseToFrontend()

        response = zip_response(result)
        return response, 200

    except Exception as e:
        current_app.logger.warning(f'Cloning of antrag {id} failed: {e}')
    
    return jsonify({'error': f'Cloning of antrag instance failed'}), 400


@bp.route('/antrag/delete/<string:id>', methods=['DELETE'])
@auth.login_required
def delete_antrag(id):
    #
    # delete antrag instance from store by <id>
    #

    # check if instance exists
    if id not in current_app.config['ANTRAGS']:
        return jsonify({'error': f'Antrag instance {id} not found'}), 404

    current_app.config['ANTRAGS'] = {key: value for key, value in current_app.config['ANTRAGS'].items() if key != id}
    return jsonify({'OK': f'Antrag instance {id} successfully deleted'}), 200



@bp.route('/antrag/tag/<string:antrag_id>', methods=['POST', 'DELETE'])
@auth.login_required
def antrag_tag(antrag_id):
    #
    # set or delete custom tag of antrag
    #

    # get antrag from app store
    antrag = current_app.config['ANTRAGS'].get(antrag_id)
    if antrag is None:
        current_app.logger.warning(f'Antrag {antrag_id} is absent in PoLZy storage. Most probably instance restarted.')
        return jsonify({'error': f'Antrag instance not found'}), 400

    # update tag
    if request.method == 'POST':
        # get tag from payload
        tag = request.get_json().get('tag')
        if tag:
            antrag.setCustomTag(tag)
            return {'OK': 'Custom Tag successfully set'}, 200

    # delete tag
    antrag.setCustomTag(None)
    return {'OK': 'Custom Tag successfully deleted'}, 200


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
        result = antrag.parseToFrontend()
        
        response = zip_response(result)
        return response, 200

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
        
        response = zip_response(result)
        return response, 200

    except Exception as e:
        current_app.logger.exception(f'Failed execute activity {data.get("activity")} of antrag {data.get("id")}: {e}')
    
    return jsonify({'error': f'Execution of antrag activiy {data.get("activity")} failed'}), 400



@bp.route('/antrag/records/search', methods=['POST'])
@auth.login_required
def getSearchStringFromRecords():
    data = request.get_json()

    # supplying current user to get records of current user & company
    found_antrags = AntragActivityRecords.getSearchString(auth.current_user(), data.get("value"))
    results = [{
        'id': instance.antrag_id,
        'label': instance.get_label(),  # 'get_label' method should be adjusted to proper render results
    } for instance in found_antrags] if found_antrags else []

    return jsonify(results), 200

# we have to pass only antrag id. it will be easier to use GET method
@bp.route('/antrag/records/<string:antrag_id>')#load', methods=['POST'])
@auth.login_required
def loadLatestRecords(antrag_id):

    # preventing duplication of the antrag instance
    if antrag_id in current_app.config['ANTRAGS']:
        return {'error': 'Antrag is already active'}, 409

    # get antrag record by id
    antrag_record = AntragActivityRecords.getLatest(antrag_id)
    if antrag_record is None:
        return jsonify({'error': f'No record found of antrag {antrag_id}'}), 404

    # load user with company relationships
    user = auth.current_user()
    user.company.company 

    # load antrag instance from the record and store it within the app
    antrag = antrag_factory().load(  
        antrag_record,
        deepcopy(user),
    )
    current_app.config['ANTRAGS'][antrag.uuid] = antrag

    # return antrag json
    result = antrag.parseToFrontend()
    response = zip_response(result)
    return response, 200
