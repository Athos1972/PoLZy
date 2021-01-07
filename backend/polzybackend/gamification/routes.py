from flask import jsonify, request, current_app
from polzybackend.gamification import bp
from polzybackend.models import GamificationBadge
from polzybackend import auth


@bp.route('/badges')
@auth.login_required
def badges():
    #
    # returns list of all user badges
    #

    try:
        badges = [badge.to_json() for badge in auth.current_user().badges]
        return jsonify(badges), 200
    except Exception as e:
        current_app.logger.exception(f'Faild to get Gamification Badges: {e}')
        return jsonify({'error': 'Bad Request'}), 400


@bp.route('/badges/seen', methods=['POST'])
@auth.login_required
def make_badge_seen():
    #
    # makes the bage as seen
    #

    try:

        # get request data and badge
        data = request.get_json()
        badge = data.get('badge')
        if badge is None:
            raise Exception('Badge data not found in request')

        # update badge instance
        GamificationBadge.make_seen(badge)

        # return updated lit of badges
        return jsonify(auth.current_user().get_badges()), 200

    except Exception as e:
        current_app.logger.exception(f'Making Gamification Badge seen fails: Badge={badge}\n{e}')
        return jsonify({'error': 'Bad Request'}), 400

