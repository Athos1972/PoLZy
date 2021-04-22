import os
import shutil
from uuid import UUID, uuid4
from datetime import datetime
from scripts.utils import db, models, admin, sample_organiztion_id
from polzyFunctions.GlobalConstants import GlobalConstants, logger
from sqlalchemy import and_, or_


class DatabaseManager:
    def __init__(self):
        self.unprocessed_rows = []
        self.directly_added_files_from_dir = self.update_files_in_db()

    def update_unprocessed_rows(self):
        # get rows with processed=False or None from File table
        self.unprocessed_rows = db.session.query(models.File).filter(and_(or_(
            models.File.processed == None, models.File.processed == False), models.File.type == "document")).all()

    def update_files_in_db(self):
        files = os.listdir(GlobalConstants.filesPath)
        original_company_id = admin.company_id  # to restore original company id on db
        admin.company_id = sample_organiztion_id  # using sample organization as default company id
        updated_files = []
        for file in files:
            if os.path.isdir(os.path.join(GlobalConstants.filesPath, file)):
                continue
            filename, extension = os.path.splitext(file)
            if filename[:2] == "~$":  # these are temp excel files created by ms excel
                os.remove(os.path.join(GlobalConstants.filesPath, file))
                continue
            try:
                id_ = UUID(filename)  # if file name is uuid that means this might already has entry in db
                db_row = db.session.query(models.File).filter_by(id=filename).first()
                if not db_row:  # if row is not found then create a new File object with this file
                    db_row = self.create_new(file, extension)
                if db_row.processed:  # if file is already processed these means we haven't moved it in archived
                    logger.info(f"{file} is already processed! Skipping it")
                    self.move_processed_file(file)
            except ValueError:  # we get value error when filename is not uuid, so update that file in db & rename it
                updated_files.append(self.create_new(file, extension))

        admin.company_id = original_company_id
        self.update_unprocessed_rows()  # fill unprocessed data in unprocessed_rows
        return updated_files

    @staticmethod
    def create_new(file, extension, parent_id=None):
        id_ = str(uuid4())
        lFile = models.File.new(user=admin, filename=file, id=id_, parent_id=parent_id)
        shutil.move(os.path.join(GlobalConstants.filesPath, file),
                    os.path.join(GlobalConstants.filesPath, id_ + extension))  # rename original filename with id
        logger.debug(f"{file} updated in db and renamed with id {id_}")
        return lFile

    @classmethod
    def set_processed(cls, file, processed_obj=None, details={}, key=None):
        filename, extension = os.path.splitext(file)

        if not processed_obj:  # getting File row object if not supplied
            processed_obj = db.session.query(models.File).filter_by(id=filename).first()

        if not key:  # zip file has different name on storage and details dict. Key is name for details dict
            key = os.path.basename(file)

        if extension.lower() == ".zip":
            if not os.path.exists(filename):
                filename = os.path.join(GlobalConstants.filesPath, filename)
                if not os.path.exists(filename):
                    processed_obj.set_processed(details=details.get(key, {}))
                    return
            files = os.listdir(filename)
            for extracted_file in files:  # these files are already processed, now creating entry in db & updating
                instance = cls.create_new(file=os.path.join(filename, extracted_file
                                                            ).replace(GlobalConstants.filesPath, ""),
                                          extension=os.path.splitext(extracted_file)[1],
                                          parent_id=filename)  # parent_id means this entry is child of a zip file
                cls.set_processed(
                    instance.id + os.path.splitext(extracted_file)[1], instance, details=details, key=extracted_file
                )  # marking the zip extracted file processed with necessary details. Details key is original filename
            try:
                os.rmdir(filename)  # after processing and moving all files delete zip directory
            except Exception as ex:  # if zip directory is not empty it will create error
                logger.critical(f"Exception while removing directory {filename}: {str(ex)}")
            details[key] = details.copy()

        processed_obj.set_processed(details=details.get(key, {}))
        cls.move_processed_file(os.path.basename(file))  # moving files to processed files directory

    @staticmethod
    def move_processed_file(file):
        if not os.path.exists(os.path.join(GlobalConstants.filesPath, file)):
            return
        directory = os.path.join(GlobalConstants.archivedFiles, datetime.now().strftime("%Y/%m"))
        os.makedirs(directory, exist_ok=True)
        os.replace(os.path.join(GlobalConstants.filesPath, file), os.path.join(directory, file))
        logger.debug(f"{file} moved to processed directory.")
