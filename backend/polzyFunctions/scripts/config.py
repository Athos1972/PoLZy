import os
from pathlib import Path

#
# configuration settings
#


class Config(object):

    # DB
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(os.path.abspath(os.getcwd()), 'polzy.db')
    
    # PATHS
    PDF = str(Path(os.path.abspath(__file__)).parent.joinpath("pdfoutput"))
    UPLOADS = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'BatchFiles')
    MEDIA = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'media')
    LOGO = os.path.join(MEDIA, 'logo')
    BADGES = os.path.join(MEDIA, 'badges')
    IMAGES = os.path.join(MEDIA, 'images')

    # Local URI
    HOST = 'http://localhost:5000'
    DOWNLOADS = 'files'
    LOGO_URI = 'logo'

    # flask monitoring dashboard
    DASHBOARD_CONFIG = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'dashboard.cfg')
    DASHBOARD_DATABASE_URI = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'dashboard.db')
    DEBUG = True
