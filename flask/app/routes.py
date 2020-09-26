from flask import jsonify, request#, url_for, send_file
from app import app, models, policy


@app.route('/policy/<string:policy_number>/<string:effective_date>')
def get_policy(policy_number, effective_date):
	item = policy.Policy(policy_number, effective_date)
	item.fetch()
	if item.data:
		return jsonify(item.data), 200

	return jsonify({'error': 'Policy not found'}), 404

