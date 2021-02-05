from flask import Response
from datetime import date
from polzybackend.announce import bp
from polzybackend import messenger
from polzybackend import auth, db
from polzybackend import messenger
from polzybackend.models import ToastNotifications, GamificationBadge
import json

@bp.route('/listen', methods=['GET'])
def listen():

    def stream():
        messages = messenger.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            yield msg

    return Response(
        stream(),
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "X-Accel-Buffering": "no",
        },
        mimetype='text/event-stream',
    )


@bp.route("/notifications", methods=["POST"])
@auth.login_required
def notifications():
    user = auth.current_user()
    toasts = [toast for toast in db.session.query(ToastNotifications).filter_by(
        seen_at=None).filter_by(user_id=user.id).filter_by(company_id=user.company_id)]
    for toast in toasts:
        if toast.type == "badge":
            badge = db.session.query(GamificationBadge).filter_by(id=toast.message, duration=5000).first()
            messenger.announce_badge(badge=badge)
        else:
            msg = json.dumps({
                'text': toast.message,
                'autoHideDuration': 3000,
                'variant': toast.type,
                'anchorOrigin': {
                    'horizontal': 'left',
                    'vertical': 'bottom',
                }
            })
            print(msg)
            messenger.announce(f'data: {msg}\n\n')
        toast.set_seen()
    return Response(status=200)
