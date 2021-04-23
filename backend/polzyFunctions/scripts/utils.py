if __name__ == "__main__":
    import AddRoot
import io
import sys
from polzybackend import models
from polzybackend import create_app
from flask_sqlalchemy import SQLAlchemy


save_stdout = sys.stdout  # saves original stdout
sys.stdout = io.StringIO()  # using dummy handler for stdout
from polzyFunctions.scripts.config import Config  # This command throws a print statement therefore using dummy stdout handler
sys.stdout = save_stdout  # restoring original stdout handler


def get_db():
    Config.DEBUG = True
    app = create_app(Config)
    return SQLAlchemy(app)

db = get_db()
models.db = db  # replacing module's db with initiatized db so session commits go successful


admin = db.session.query(models.User).filter_by(email="admin@polzy.com").first()
sample_organiztion = db.session.query(models.Company).filter_by(name="Sample Organization").first()
if sample_organiztion:
    sample_organiztion_id = sample_organiztion.id
