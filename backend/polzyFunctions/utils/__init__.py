import os


class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            if cls not in cls._instances:
                cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


def get_file_path(fileName, basepath=""):
    if basepath and os.path.isfile(os.path.join(basepath, fileName)):
        return os.path.join(basepath, fileName)
    elif os.path.isfile(os.path.join(os.getcwd(), fileName)):
        return os.path.join(os.getcwd(), fileName)
    else:
        print(f"{fileName} path not found!")
        return fileName