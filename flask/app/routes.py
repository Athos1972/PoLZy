from flask import jsonify, request
from app import app
from datetime import date
from app.policy import Policy
from app.base_models import Activity, ActivityType


@app.route('/policy/<string:policy_number>/<string:effective_date>')
@app.route('/policy/<string:policy_number>')
def get_policy(policy_number, effective_date=None):
    #
    # fetches a Policy by policy_number & effective_data
    # and returns it
    #

    # set default effective_date if needed
    if effective_date is None:
        effective_date = str(date.today())

    # get Policy
    policy = Policy(policy_number, effective_date)
    if policy.fetch():
        return jsonify(policy.get()), 200

    return jsonify({'error': 'Policy not found'}), 404


@app.route(f'/activity', methods=['POST'])
def new_activity():
    #
    # create new activity
    #

    # get post data
    data = request.get_json()

    # create activity
    try:
        activity = Activity.create_from_json(data)
        return jsonify({
            'id': str(activity),
            'status': 'accepted',
            'msg': 'Activity accepted',
        }), 202
    except Exception as e:
        print(e)
        return jsonify({'error': 'Bad Request'}), 400
