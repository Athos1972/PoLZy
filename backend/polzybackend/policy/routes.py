from flask import jsonify, request, current_app
from datetime import date
from polzybackend.policy import bp
from polzybackend import auth
from polzybackend.utils.import_utils import policy_class
from polzybackend.models import Activity


@bp.route('/policy/<string:policy_number>/<string:effective_date>')
@bp.route('/policy/<string:policy_number>')
@auth.login_required
def get_policy(policy_number, effective_date=None):
    #
    # fetches a Policy by policy_number & effective_data
    # and returns it
    #

    # set default effective_date if needed
    if effective_date is None:
        effective_date = str(date.today())

    try:
        # get Policy
        policy = policy_class()(policy_number, effective_date)
        # update policy stage and language
        policy.setStage(auth.current_user().stage)
        policy.setLanguage(auth.current_user().language)
        policy.set_user(auth.current_user())
        current_app.logger.info(f"Policy={policy_number}, Stage={policy.stage}, lang={policy.language}")

        if policy.fetch():
            policy.set_user(auth.current_user())
            current_app.config['POLICIES'][policy.id] = policy
            result = policy.get()

            # save activity to DB
            Activity.read_policy(policy_number, effective_date, auth.current_user())
            
            # set response
            response_code = 400 if 'error' in result else 200
            return jsonify(result), response_code

    except Exception as e:
        current_app.logger.exception(f'Fetch policy {policy_number} {effective_date} failed: {e}')
        return jsonify({'error': str(e)}), 400

    return jsonify({'error': 'Policy not found'}), 404


@bp.route('/policy/delete/<string:id>', methods=['DELETE'])
@auth.login_required
def delete_policy(id):
    #
    # delete policy instance from store by <id>
    #

    # check if instance exists
    if id not in current_app.config['POLICIES']:
        return jsonify({'error': f'Policy instance {id} not found'}), 404

    current_app.config['POLICIES'] = {key: value for key, value in current_app.config['POLICIES'].items() if key != id}
    return jsonify({'OK': f'Policy instance {id} successfully deleted'}), 200


@bp.route(f'/policy/activity', methods=['POST'])
@auth.login_required
def new_activity():
    #
    # create new activity
    #

    # get post data
    data = request.get_json()

    # get policy and create activity 
    try:
        # get policy from app store
        policy = current_app.config['POLICIES'].get(data['id'])
        if policy is None:
            raise Exception(f'Policy {data["id"]} is absent in PoLZy storage')

        # save activity to DB
        activity = Activity.new(data, policy, auth.current_user())

        # execute activity
        result = policy.executeActivity(data['activity'])
        # update activity status
        activity.finish('OK' if result else 'Failed')

        if result:
            # update policy
            policy.setStage(auth.current_user().stage)
            policy.setLanguage(auth.current_user().language)
            current_app.logger.info(f"Stage={policy.stage}, lang={policy.language}")

            # check if activity returns not bool result
            if result is not True:
                return jsonify(result), 200

            policy.fetch()
            return jsonify(policy.get()), 200
        
    except Exception as e:
        current_app.logger.exception(f'Execution activity {data.get("name")} for policy {data["id"]} faild: {e}')
        return jsonify({'error': 'Bad Request'}), 400

    return jsonify({
        'id': str(activity.id),
        'status': 'Failed',
    }), 400


@bp.route('/policy/update', methods=['POST'])
@auth.login_required
def update_policy():
    #
    # updates activity fields
    #

    # get post data
    data = request.get_json()

    # DEBUG
    print('\n*** Update Policy Fields...')
    import json
    print(json.dumps(data, indent=2))
    print()
    # DEBUG END

    # get policy and update its values
    try:
        # get policy from app store
        policy = current_app.config['POLICIES'].get(data['id'])
        if policy is None:
            raise Exception(f'Policy {data["id"]} is absent in PoLZy storage. Most probably instance restarted.')

        # update policy values
        policy.updateFields(data)
        result = policy.get()
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.exception(f'Policy {data["id"]} update failed: {e}')
    
    return jsonify({'error': f'Update of the policy fields failed'}), 400


@bp.route(f'/report', methods=['POST'])
@auth.login_required
def report():

    # get request body
    data = request.get_json()

    print(data)
    return {}, 200
