from flask import jsonify, request, current_app
from datetime import date
from ..policy import Policy
from ..models import Activity, ActivityType
from ..utils import get_policy_class, get_activity_class
from . import bp


@bp.route('/policy/<string:policy_number>/<string:effective_date>')
@bp.route('/policy/<string:policy_number>')
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
        policy = get_policy_class()(policy_number, effective_date)
        if policy.fetch():
            current_app.config['POLICIES'][policy.uuid] = policy
            return jsonify(policy.get()), 200
    except Exception as e:
        current_app.logger.warning(f'Fetch plolicy {policy_number} {effective_date} failed: {e}')
        return jsonify({'error': str(e)}), 400

    return jsonify({'error': 'Policy not found'}), 404


@bp.route(f'/activity', methods=['POST'])
def new_activity():
    #
    # create new activity
    #

    # get post data
    data = request.get_json()
    print(data)
    print(current_app.config.get('POLICIES'))

    # get policy and create activity 
    try:
        # get policy from app store
        policy = current_app.config['POLICIES'].get(data['id'])
        if policy is None:
            raise Exception(f'Policy {data["id"]} is absent in PoLZy storage')

        # save activity to DB
        activity = Activity.new(data, policy)

        # execute activity
        if policy.executeActivity(data['activity']):
            # update activity
            activity.finish()
            # update policy
            policy.fetch()
            return jsonify(policy.get()), 200
        
    except Exception as e:
        print(e)
        return jsonify({'error': 'Bad Request'}), 400

    return jsonify({
        'id': str(activity),
        'status': 'accepted',
        'msg': 'Activity accepted',
    }), 202
