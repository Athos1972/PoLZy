import os
import csv
import xlrd
import codecs

from polzyFunctions.FileManager.utils import headers
from polzyFunctions.GlobalConstants import logger
from zipfile import ZipFile




class Handler:
    def __init__(self, fileNameAndPath, originalFileName, extension):
        self.fileNameAndPath = fileNameAndPath
        self.originalFileName = originalFileName
        self.extension = extension
        self.data = self.get_data()

    def get_data(self):
        logger.debug(f"Getting data.")
        try:
            return getattr(self, self.extension[1:])(self.fileNameAndPath)  # function names and extension name are same
        except AttributeError:
            raise Exception(f"{self.extension} files are not supported yet")

    def csv(self, filename):
        all_data = []  # this list will store csv data with delimiter of all types
        self.open_csv_with_delimiter(",", all_data, filename)
        self.open_csv_with_delimiter(":", all_data, filename)
        self.open_csv_with_delimiter(";", all_data, filename)
        self.open_csv_with_delimiter("|", all_data, filename)
        self.open_csv_with_delimiter("\t", all_data, filename)

        if not all_data:
            return {os.path.basename(filename): {"status_ok": False, "error": "Csv delimiter is not recognized!"}}

        all_data.sort(reverse=True)
        return {os.path.basename(filename): all_data[0][1]}  # list with maximum number of data is used

    def open_csv_with_delimiter(self, delimiter, all_data, filename):
        data_list = []
        with codecs.open(filename, 'r', encoding="utf-8") as file:  # codecs is used to avoid error in german alphabet
            data = csv.DictReader(file, delimiter=delimiter)
            for d in data:
                data_list.append(d)
        columns = len(data_list[0])         # length of header is used to compare length of all row.
        equal_columns_in_rows = True        # If row length not matched that means most probably it is wrong delimiter.
        for d in data_list:
            if len(d) != columns:           # Removing delimiter data when all row lenght not matched with header
                equal_columns_in_rows = False
                break
        if equal_columns_in_rows:
            all_data.append([columns, data_list])

    def xlsx(self, filename):
        data_list = []
        wb = xlrd.open_workbook(filename)
        sht = wb.sheets()[0]
        for row in range(sht.nrows):
            data_list.append(sht.row(row))
        header_alignment = self.get_xlsx_header_alignment(sht, data_list)
        if not header_alignment:
            return {os.path.basename(filename): {
                    "status_ok": False,
                    "error": f"Cannot determine headers alignment in {filename}, skipping this file."
            }}  # saving error as dict value instead of list, it will help in differentiating further
        return {os.path.basename(filename): self.sheet_list_to_dict(header_alignment, data_list)}

    def get_xlsx_header_alignment(self, sht, data_list):
        header_row_count = 0
        header_col_count = 0
        for cell in data_list[0]:
            if cell.value.lower() in headers:  # counting cell values matching with expected headers for column
                header_col_count += 1

        for row in data_list:
            if row[0].value.lower() in headers:  # counting cell values matching with expected headers for row
                header_row_count += 1

        logger.debug(f"Headers matching: column - {str(header_col_count)}, row - {str(header_row_count)}")
        if header_row_count > header_col_count:  # if row matching header count is greater than rows contain headers
            return "row"
        return "column"

    def sheet_list_to_dict(self, header_alignment, data_list):
        # converting sheet object to dict
        data = []
        if header_alignment == "column":
            headers = [cell.value for cell in data_list[0]]
            for row in data_list:
                dic = {}
                for i in range(len(row)):
                    dic[headers[i]] = row[i].value
                data.append(dic)
        elif header_alignment == "row":
            headers = [row[0].value for row in data_list]

            for column_index in range(1, len(data_list[0])):
                dic = {}
                for row_index in range(len(data_list)):
                    dic[headers[row_index]] = data_list[row_index][column_index].value
                data.append(dic)
        return data

    def zip(self, filename):
        # if zip file than extract inner content and process them
        all_data = {}
        zipNameAndPath = os.path.splitext(self.fileNameAndPath)[0]
        with ZipFile(self.fileNameAndPath, "r")as file:
            file.extractall(zipNameAndPath)
        zipfiles = os.listdir(zipNameAndPath)
        for file in zipfiles:
            try:
                data = getattr(self, os.path.splitext(file)[1][1:])(os.path.join(zipNameAndPath, file))
                if data:
                    all_data.update(data)
            except AttributeError:
                raise NotImplementedError(f"{self.extension} files are not supported yet")
        return all_data
