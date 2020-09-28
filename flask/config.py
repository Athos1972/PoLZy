import os


#
# configuration settings
#

class Config(object):
    # flask secret key
    SECRET_KEY = os.getenv('SECRET_KEY') or 'secret!key'

    # json format
    JSON_SORT_KEYS = False

    # DB connection
    SQLALCHEMY_DATABASE_URI = os.getenv(
    	'DATABASE_URL',
    	default='sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'polzy.db'),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    
