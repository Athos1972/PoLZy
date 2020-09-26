#from sqlalchemy import Column, LargeBinary, String
#from baangt.base.DataBaseORM import base, engine
#from sqlalchemy.orm import sessionmaker
from app import db, auth
from datetime import datetime, timedelta, date
from random import choice
import uuid
import string

ACCESS_KEY_LENGTH = 64
EXPIRED_HOURS = 24
ACTIVITY_TYPES = [
    'cancel',
    'suspend',
    'Change',

]

def get_uuid():
    return uuid.uuid4().bytes

def generate_token(lenght=ACCESS_KEY_LENGTH):
    simbols = string.letters + string.digits + '!#$%&*+-<=>?@'
    return ''.join(choice(simbols) for i in range(length))

def get_expired(hours=EXPIRED_HOURS, days=0):
    return datetime.utcnow() + timedelta(hours=hours, days=days)

# authentication
@auth.verify_token
def verify_token(token):
    user = User.query.filter_by(access_key=token).first()
    if user.key_expired < datetime.utcnow():
        return user


#
# Authentication Models
#
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.LargeBinary, primary_key=True, default=get_uuid)
    email = db.Column(db.String(64), unique=True, nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    displayed_name = db.Column(db.String(64), nullable=False, default='none')
    first_name = db.Column(db.String(64), nullable=True)
    last_name = db.Column(db.String(64), nullable=True)
    oauth_provider_id = db.Column(db.Integer, db.ForeignKey('oauth_providers.id'), nullable=False)
    oauth_user_id = db.Column(db.String(128), nullable=False)
    oauth_token = db.Column(db.String(128), nullable=False)
    access_key = db.Column(db.String(128), nullable=False, default=generate_token)
    key_expired = db.Column(db.DateTime, nullable=False, default=get_expired)

    # realshinships
    oauth_provider = db.relationship(
        'OAuthProvider',
        foreign_keys=[oauth_provider_id],
    )

    def __str__(self):
        return self.displayed_name

    def get_name(self):
        return self.email.split('@')[0]

class OAuthProvider(db.Model):
    __tablename__ = 'oauth_providers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    client_id = db.Column(db.String(128), nullable=False)
    secret_key = db.Column(db.String(128), nullable=False)

    def __str__(self):
        return self.name


#
# Activity Models
#
class Activity(db.Model):
    __tablename__ = 'activities'
    id = db.Column(db.LargeBinary, primary_key=True, default=get_uuid)
    creator_id = db.Column(db.LargeBinary, db.ForeignKey('users.id'), nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    policy_number = db.Column(db.String(64), nullable=False)
    effective_date = db.Column(db.Date, nullable=False, default=date.today())
    type_id = db.Column(db.Integer, db.ForeignKey('activity_types.id'), nullable=False)
    is_finished = db.Column(db.Boolean, nullable=False, default=False)
    
    # realshinships
    creator = db.relationship(
        'User',
        backref=db.backref('created_activities', order_by='desc(Activity.created)'),
        foreign_keys=[creator_id],
    )
    type = db.relationship(
        'ActivityType',
        foreign_keys=[type_id],
    )

    def __str__(self):
        return str(uuid.UUID(bytes=self.id))

class ActyvityType(db.Model):
    __tablename__ = 'activity_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(128), nullable=True)

# 
# Activity Values
#

class PartnerValues(db.Model):
    __tablename__ = 'partners'
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.LargeBinary, db.ForeignKey('activity.id'), nullable=False)
    is_person = db.Column(db.Boolean, nullable=False)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    middle_name = db.Column(db.String(64))
    birth_date = db.Column(db.Date)
    company_name = db.Column(db.String(64))
    address = db.Column(db.String(128))
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))
    postal_code = db.Column(db.String(16))
    primary_email = db.Column(db.String(64))
    secondary_email = db.Column(db.String(64))
    primary_phone = db.Column(db.String(16))
    secondary_phone = db.Column(db.String(16))
    risk_group = db.Column(db.String(64))
    current_occupation = db.Column(db.String(64))
    current_occupation_from = db.Column(db.Date)
    previous_ocupation = db.Column(db.String(64))
    sports = db.Column(db.String(64))
    health_conditions = db.Column(db.String(256))
    
    # realshinships
    activity = db.relationship(
        'Activity',
        backref=db.backref('values', uselist=False),
        foreign_keys=[activity_id],
        uselist=False,
    )

