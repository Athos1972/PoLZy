import uuid
from flask import make_response, json, jsonify, current_app
import gzip

#
# system date format
#
date_format = "%Y-%m-%d"


#
# id generator
#
def generate_id():
    return str(uuid.uuid4())


def zip_response(payload):
    #
    # conditional compression of json payload
    #

    # convert payload to string
    content = json.dumps(payload).encode('utf8')
    current_app.logger.debug(f'Antrag Response - original size:\t{len(content)}')

    # compress payload by size
    if len(content) < current_app.config['COMPRESS_MIN_SIZE']:
        # no compression
        return jsonify(payload)

    # compression
    content_zip = gzip.compress(content, 5)
    response = make_response(content_zip)
    response.headers['content-encoding'] = 'gzip'
    current_app.logger.debug(f'Antrag Response - compressed size:\t{response.headers.get("content-length")}')

    return response