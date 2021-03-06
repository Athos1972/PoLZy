from flask import jsonify, request, current_app
from datetime import date
from polzybackend.policy import bp
from polzybackend import auth
from polzybackend.utils.import_utils import policy_factory
from polzybackend.models import Activity
from copy import deepcopy


@bp.route('/policy/<string:policy_number>/<string:effective_date>')
@bp.route('/policy/<string:policy_number>')
@auth.login_required
def get_policy(policy_number, effective_date=None):
    #
    # fetches a Policy by policy_number & effective_data
    # and returns it
    #

    policy_date = effective_date or str(date.today())

    try:
        # load user and its relationships
        user = auth.current_user()
        user.company.company
        # create policy
        policy = policy_factory().create(
            policy_number,
            policy_date,
            deepcopy(user),
        )
        current_app.logger.info(f"Policy={policy_number}, Stage={policy.stage}, lang={policy.language}")
        # create policy activity
        Activity.read_policy(policy_number, policy_date, user)
        # store policy to app and return as json object
        current_app.config['POLICIES'][policy.UUID] = policy
        result = policy.parseToFrontend()
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.exception(f'Fetch policy {policy_number} {policy_date} failed: {e}')
        return jsonify({'error': str(e)}), 400


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

        # load user and its relationships
        user = auth.current_user()
        user.company.company
        # save activity to DB
        activity = Activity.new(data, policy, user)

        # execute activity
        result = policy.executeActivity(data['activity'])
        # update activity status
        activity.finish('OK' if result else 'Failed')

        if result:
            # update policy
            update_policy = policy_factory().update(policy, deepcopy(user))
            current_app.config['POLICIES'][policy.UUID] = update_policy
            current_app.logger.info(f"Policy={update_policy.number}, Stage={update_policy.stage}, lang={update_policy.language}")

            # check if activity returns not bool result
            if result is not True:
                return jsonify(result), 200

            result = update_policy.parseToFrontend()
            update_achievement()
            return jsonify(result), 200

        if result is None:
            # activity execution not implemented
            return jsonify({
                'id': policy.UUID,
                'activity': activity.type,
                'status': 'not implemented',
            }), 409

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
        if policy.updateActivityFields(data):
            result = policy.parseToFrontend()
            return jsonify(result), 200

        raise Exception(f'Activity {data.get("activity")} not found')

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
