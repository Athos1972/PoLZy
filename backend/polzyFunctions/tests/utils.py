from polzybackend.models import User, Company
from flask_sqlalchemy import SQLAlchemy
from polzybackend import create_app, models
from polzyFunctions.tests.config import Config
import pytest

app = create_app(Config)
app.app_context().push()
db = SQLAlchemy(app)
models.db = db


@pytest.fixture(scope="session")
def user():
    return db.session.query(User).first()


@pytest.fixture(scope="session")
def company():
    return db.session.query(Company).filter_by(name="Sample Organization").first()
