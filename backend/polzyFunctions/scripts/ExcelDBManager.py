import pandas as pd
from polzybackend.models import User, Company, UserToCompany, CompanyToCompany, Role, user_company_roles
from polzybackend.utils.auth_utils import generate_token
import uuid
from flask_sqlalchemy import SQLAlchemy
from polzybackend import create_app
from ast import literal_eval
import sys
import io
import os
import xlrd
import json
from config import Config


def print_args():
    print("""    This program is used to download excel file or upload data from excel file in a polzy.db
    To download data use command = python ExcelDBManager.py --download
    To upload data use command   = python ExcelDBManager.py --upload path/to/excelfile.xlsx""")


def uuidBytes2String(byte):
    # used to convery uuid bytes to string
    if not byte:
        return
    elif isinstance(byte, bytes):
        string = str(uuid.UUID(bytes=byte))
        return string
    return byte


def string2bool(string):
    if isinstance(string, str):
        if string.lower().strip() == "true" or string.lower().strip() == "1":
            return True
    elif isinstance(string, int) or isinstance(string, float):
        if string >= 1:
            return True
    return False


def attributes_to_boolean(js):
    # converts only string "true" or "false" in boolean, because we don't need to convert int to bool in attributes
    try:
        attribute_json = json.loads(js)
    except:
        print(
            "Attributes are not in correct json format. Please make sure to use correct syntax like double inverted "
            "commas(\"), commas(,), etc. If you are using boolean values in Attributes. Else it is fine."
        )
        return js

    for key in attribute_json:
        if str(attribute_json[key]).lower().strip() == "true":
            attribute_json[key] = True
        elif str(attribute_json[key]).lower().strip() == "false":
            attribute_json[key] = False
    return json.dumps(attribute_json, ensure_ascii=False)


def download_excel(fileNameAndPath="db2excel.xlsx"):
    dfs = {}
    # reading database with pandas and storing table_name:dataframe(converted table) as key:value
    dfs[User.__tablename__] = pd.read_sql_table(User.__tablename__, Config.SQLALCHEMY_DATABASE_URI)
    dfs[Company.__tablename__] = pd.read_sql_table(Company.__tablename__, Config.SQLALCHEMY_DATABASE_URI)
    dfs[UserToCompany.__tablename__] = pd.read_sql_table(UserToCompany.__tablename__, Config.SQLALCHEMY_DATABASE_URI)
    dfs[CompanyToCompany.__tablename__] = pd.read_sql_table(CompanyToCompany.__tablename__, Config.SQLALCHEMY_DATABASE_URI)
    dfs[Role.__tablename__] = pd.read_sql_table(Role.__tablename__, Config.SQLALCHEMY_DATABASE_URI)
    dfs[user_company_roles.name] = pd.read_sql_table(user_company_roles.name, Config.SQLALCHEMY_DATABASE_URI)

    # converting uuid bytes to string
    dfs[User.__tablename__]["id"] = dfs[User.__tablename__]["id"].apply(lambda x: uuidBytes2String(x))
    dfs[User.__tablename__]["company_id"] = dfs[User.__tablename__]["company_id"].apply(lambda x: uuidBytes2String(x))
    dfs[Company.__tablename__]["id"] = dfs[Company.__tablename__]["id"].apply(lambda x: uuidBytes2String(x))
    dfs[UserToCompany.__tablename__]["user_id"] = dfs[UserToCompany.__tablename__]["user_id"
                                                                        ].apply(lambda x: uuidBytes2String(x))
    dfs[UserToCompany.__tablename__]["company_id"] = dfs[UserToCompany.__tablename__]["company_id"
                                                                        ].apply(lambda x: uuidBytes2String(x))
    dfs[CompanyToCompany.__tablename__]["child_id"] = dfs[CompanyToCompany.__tablename__]["child_id"
                                                                        ].apply(lambda x: uuidBytes2String(x))
    dfs[CompanyToCompany.__tablename__]["parent_id"] = dfs[CompanyToCompany.__tablename__]["parent_id"
                                                                        ].apply(lambda x: uuidBytes2String(x))
    dfs[user_company_roles.name]["user_id"] = dfs[user_company_roles.name]["user_id"
                                                                        ].apply(lambda x: uuidBytes2String(x))
    dfs[user_company_roles.name]["company_id"] = dfs[user_company_roles.name]["company_id"
                                                                        ].apply(lambda x: uuidBytes2String(x))

    with pd.ExcelWriter(fileNameAndPath, engine='xlsxwriter')as writer:
        for df in dfs:  # writing excel sheets with table name as sheet name
            dfs[df].to_excel(writer, df, index=False)
            worksheet = writer.sheets[df]  # pull worksheet object
            for idx, col in enumerate(dfs[df]):  # loop through all columns
                series = dfs[df][col]
                max_len = max((
                    series.astype(str).map(len).max(),  # len of largest item
                    len(str(series.name))  # len of column name/header
                )) + 1  # adding a little extra space
                worksheet.set_column(idx, idx, max_len)  # set column width
    return os.path.abspath(fileNameAndPath)


class UploadExcel:
    def __init__(self, fileName):
        """
        This class is used to upload data in polzy.db from excel sheet
        :param fileName: Excel file name with complete path
        """
        self.fileName = fileName
        self.uuids = {}  # stored uuids string as key and object as value which is later used when same uuid string is supplied
        self.db = self.get_db()
        self.users = {}  # stores User object which is later used in updating UserToCompany table
        self.companies = {} # stores Company object which is later used in updating UserToCompany and CompanyToCompany Table
        self.dfs = self.get_sanitized_dfs()

    def get_db(self):
        app = create_app(Config)
        return SQLAlchemy(app)

    def handleUUID(self, uid):
        # returns uuid bytes from string or create a new one and return it
        if not uid:
            return
        if uid not in self.uuids:
            try:
                self.uuids[uid] = str(uuid.UUID(uid))  # if the input id string is correct then it will generate uuid object
            except ValueError:  # if it is incorrect then it stores it as key and new uuid object as value
                self.uuids[uid] = str(uuid.uuid4())
        return self.uuids[uid]

    def get_sanitized_dfs(self):
        dfs = {}

        # User table replacing nan values with 0
        try:
            user_table = pd.read_excel(self.fileName, sheet_name=User.__tablename__)
        except xlrd.biffh.XLRDError:
            print("Given file is not a valid excel(xlsx) file!")
            sys.exit()
        user_table.fillna(0, inplace=True)
        dfs[User.__tablename__] = user_table

        # Company Table replacing nan values with 0
        company_table = pd.read_excel(self.fileName, sheet_name=Company.__tablename__)
        company_table.fillna(0, inplace=True)
        dfs[Company.__tablename__] = company_table

        # UserToCompany Table replacing nan values with 0
        user2company_table = pd.read_excel(self.fileName, sheet_name=UserToCompany.__tablename__)
        user2company_table.fillna(0, inplace=True)
        dfs[UserToCompany.__tablename__] = user2company_table

        # CompanyToCompany Table replacing nan values with 0
        company2company_table = pd.read_excel(self.fileName, sheet_name=CompanyToCompany.__tablename__)
        company2company_table.fillna(0, inplace=True)
        dfs[CompanyToCompany.__tablename__] = company2company_table

        roles_table = pd.read_excel(self.fileName, sheet_name=Role.__tablename__)
        roles_table.fillna(0, inplace=True)
        dfs[Role.__tablename__] = roles_table

        user_company_roles_table = pd.read_excel(self.fileName, sheet_name=user_company_roles.name)
        user_company_roles_table.fillna(0, inplace=True)
        dfs[user_company_roles.name] = user_company_roles_table

        return dfs

    def remove_nan(self, data):
        # removes key which has 0 as value because we have replace nan from 0 in dataframe
        removeable = []
        for dt in data:
            if data[dt] == 0:
                removeable.append(dt)
        for rm in removeable:
            del data[rm]

    def get_user(self, uid):
        if uid in self.users:
            return self.users[uid]
        user = self.db.session.query(User).filter(User.id == uid).first()
        return user

    def get_company(self, uid):
        if uid in self.companies:
            return self.companies[uid]
        company = self.db.session.query(Company).filter(Company.id == uid).first()
        return company

    def upload_user(self):
        user_table = self.dfs[User.__tablename__]
        user_table["id"] = user_table["id"].apply(lambda x: self.handleUUID(x))  # converting string uuid to bytes
        user_table["company_id"] = user_table["company_id"].apply(lambda x: self.handleUUID(x))
        data_dict = user_table.to_dict('r')  # converts dataframe into dict 'r' parameter is to remove index key
        for data in data_dict:
            self.remove_nan(data)
            user = self.db.session.query(User).filter(User.email == data["email"]).first()
            if not user:  # if data is not already present in database then create a new row
                user = User(**data)
            else:
                for key in data:  # if data their than update the existing database
                    if getattr(user, key):
                        setattr(user, key, data[key])
            self.users[user.id] = user  # saving the User object which is later use in updating other table
            self.db.session.add(user)
        try:
            self.db.session.commit()
        except Exception as ex:
            print(f"Exception while committing changes in db: {ex}")
            self.db.session.rollback()

    def upload_company(self):
        company_table = self.dfs[Company.__tablename__]
        company_table["id"] = company_table["id"].apply(lambda x: self.handleUUID(x))
        data_dict = company_table.to_dict('r')
        for data in data_dict:
            self.remove_nan(data)
            company = self.db.session.query(Company).filter(Company.name == data["name"]).first()
            if data.get("attributes"):  # If attribute is boolean convert it in boolean
                attributes = attributes_to_boolean(data.get("attributes"))
                data["attributes"] = attributes
            if not company:
                company = Company(**data)
            else:
                for key in data:
                    if getattr(company, key):
                        setattr(company, key, data[key])
            self.companies[company.id] = company
            self.db.session.add(company)
        try:
            self.db.session.commit()
        except Exception as ex:
            print(f"Exception while committing changes in db: {ex}")
            self.db.session.rollback()

    def upload_role(self):
        roles_table = self.dfs[Role.__tablename__]
        data_dict = roles_table.to_dict('r')
        for data in data_dict:
            self.remove_nan(data)
            roles = self.db.session.query(Role).filter_by(id=data['id']).first()
            if not roles:
                is_supervisor = True if str(data['is_supervisor']).upper() in ["TRUE", "1"] else False
                roles = Role(id=data["id"], name=data["name"], is_supervisor=is_supervisor)
            else:
                roles.name = data["name"]
                roles.is_supervisor = string2bool(data.get('is_supervisor', 0))
            self.db.session.add(roles)
        try:
            self.db.session.commit()
        except Exception as ex:
            print(f"Exception while committing changes in db: {ex}")
            self.db.session.rollback()

    def upload_user2company(self):
        user_company_roles_dict = self.dfs["user_company_roles"].to_dict('r')

        def get_role_id(user_id, company_id):  # used to get role id for current user & company relation
            for user_company in user_company_roles_dict:
                if user_company["user_id"] == user_id and user_company["company_id"] == company_id:
                    return user_company["role_id"]

        def get_role_object(id):  # returns role object from role id
            return self.db.session.query(Role).filter_by(id=int(id.strip())).first()

        user2company_table = self.dfs[UserToCompany.__tablename__]
        user2company_table["role"] = user2company_table.apply(lambda x: get_role_id(x["user_id"], x["company_id"]), axis=1)
        user2company_table["user_id"] = user2company_table["user_id"].apply(lambda x: self.handleUUID(x))
        user2company_table["user"] = user2company_table["user_id"].apply(lambda x: self.get_user(x) )
        user2company_table["company_id"] = user2company_table["company_id"].apply(lambda x: self.handleUUID(x))
        user2company_table["company"] = user2company_table["company_id"].apply(lambda x: self.get_company(x))
        data_dict = user2company_table.to_dict('r')
        for data in data_dict:
            self.remove_nan(data)
            # here 2 filters are used as we have company and user id and this sequence will not repeat because it is
            # expected that a user and a company will have only single relation
            user2company = self.db.session.query(UserToCompany
                                            ).filter(UserToCompany.user_id == data["user_id"]
                                                ).filter(UserToCompany.company_id == data["company_id"]).first()
            if data.get("attributes"):  # If attribute is boolean convert it in boolean
                attributes = attributes_to_boolean(data.get("attributes"))
                data["attributes"] = attributes
            if not user2company:
                user2company = UserToCompany(
                    user_id=data["user_id"], company_id=data["company_id"],
                    attributes=data.get("attributes", ""),
                    roles=[get_role_object(role) for role in str(data.get("role", "")).split(",")]
                )
            else:
                user2company.user_id = data["user_id"]
                user2company.company_id = data["company_id"]
                user2company.attributes = data.get("attributes", "")
                user2company.roles = [get_role_object(role) for role in str(data.get("role", "")).split(",")]
            self.db.session.add(user2company)
        try:
            self.db.session.commit()
        except Exception as ex:
            print(f"Exception while committing changes in db: {ex}")
            self.db.session.rollback()

    def upload_company2company(self):
        company2company_table = self.dfs[CompanyToCompany.__tablename__]
        company2company_table["parent_id"] = company2company_table["parent_id"].apply(lambda x: self.handleUUID(x))
        company2company_table["parent"] = company2company_table["parent_id"].apply(lambda x: self.get_company(x))
        company2company_table["child_id"] = company2company_table["child_id"].apply(lambda x: self.handleUUID(x))
        company2company_table["child"] = company2company_table["child_id"].apply(lambda x: self.get_company(x))
        data_dict = company2company_table.to_dict('r')
        for data in data_dict:
            self.remove_nan(data)
            # same like user relation, company relation is also expected to be unique
            company2company = self.db.session.query(CompanyToCompany
                                                 ).filter(CompanyToCompany.parent_id == data["parent_id"]
                                                    ).filter(CompanyToCompany.child_id == data["child_id"]).first()
            if data.get("attributes"):  # If attribute is boolean convert it in boolean
                attributes = attributes_to_boolean(data.get("attributes"))
                data["attributes"] = attributes
            if not company2company:
                company2company = CompanyToCompany(**data)
            else:
                for key in data:
                    if getattr(company2company, key):
                        setattr(company2company, key, data[key])
            self.db.session.add(company2company)
        try:
            self.db.session.commit()
        except Exception as ex:
            print(f"Exception while committing changes in db: {ex}")
            self.db.session.rollback()

    def upload_data(self):
        # Main method to upload all data in db
        self.upload_user()
        self.upload_company()
        self.upload_role()
        self.upload_user2company()
        self.upload_company2company()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_args()
    elif "download" in sys.argv[1]:
        download_excel()
        print("File name db2excel.xlsx downloaded.")
    elif "upload" in sys.argv[1] and len(sys.argv) > 2:
        file = sys.argv[2]
        if not os.path.isfile(file):
            print(f"{file} doesn't exist. Please check file name or path is correct!")
        else:
            UploadExcel(file).upload_data()
            print(f"{file} successful update database.")
    else:
        print_args()
