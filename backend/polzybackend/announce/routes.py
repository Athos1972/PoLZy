from flask import Response
from datetime import date
from . import bp
from .. import messenger

@bp.route('/listen', methods=['GET'])
def listen():

    def stream():
        messages = messenger.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            yield msg

    return Response(stream(), mimetype='text/event-stream')