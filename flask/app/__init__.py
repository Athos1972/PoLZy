from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_httpauth import HTTPTokenAuth
from config import Config
#from redis import Redis
#import rq

# create application
app = Flask(__name__)
app.config.from_object(Config)

# initialization
db = SQLAlchemy(app)
migrate = Migrate(app, db)
auth = HTTPTokenAuth(scheme='Bearer')

from app import routes, models
