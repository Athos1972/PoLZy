import pytest
from polzybackend import create_app, models, db
from config import Config
from copy import deepcopy


@pytest.fixture(scope="session", params=["pqa"])
def stage(request):
    return request.param


@pytest.fixture
def user(stage=stage, email="admin@polzy.com"):
    """
    A is read from the database. if nothing stated, it will be admin@polzy.com from stage = PQA
    :param stage:
    :param email:
    :return:
    """
    app = create_app(Config)
    app.app_context().push()

    with db.session.no_autoflush:
        user = deepcopy(db.session.query(models.User).filter_by(email=email).first())
        user.stage = stage
        yield user
        db.session.remove()
