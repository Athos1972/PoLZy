from base import db, auth
from datetime import datetime, timedelta, date
from base.auth import get_uuid, generate_token, get_expired
import uuid


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

    # relationships
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
    effective_date = db.Column(db.Date, nullable=False, default=date.today)
    type_id = db.Column(db.Integer, db.ForeignKey('activity_types.id'), nullable=False)
    is_finished = db.Column(db.Boolean, nullable=False, default=False)
    
    # relationships
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

    @classmethod
    def create_from_json(cls, data):
        # 
        # create instance using data
        #

        ####### TO DELETE:
        current_user = User.query.first()
        
        # get activity type
        activity_type = ActivityType.query.filter_by(name=data.get('activity_type')).first()
        # create activity instance
        instance = cls(
            policy_number=data.get('policy_number'),
            type=activity_type,
            creator=current_user,
        )
        # set effective date
        if data.get('effective_date'):
            instance.effective_date = datetime.strptime(data.get('effective_date'), '%Y-%m-%d').date()
        
        # store to db
        db.session.add(instance)
        db.session.commit()
        
        return instance

class ActivityType(db.Model):
    __tablename__ = 'activity_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(128), nullable=True)


