import os
import sys
import json
import xlrd
import getopt


def print_args():
    print("""   This program is used to convert 2 columns of excel sheet to json data as key: value pair.
    
    Usage:
    python Excel2Json.py --file <filename and path> [options]
    
    Options:
    --file         <filename>      give excel filename with complete path
    --sheetname    <sheet name>    If you want data for a specific sheet only mention sheet name
    --start-row    <Row Number>    Input the starting Row number from where we need json data. (Row index starts from 1)
    --end-row      <Row Number>    Input the ending Row number till where we need json data. (Row index starts from 1)
    --key-column   <Column Number> Input the Column number of "Key" for json data. (Column index starts from 1)
    --value-column <Column Number> Input the Column number of "Value" for json data. (Column index starts from 1)
    """)


def args_read():
    # reading args
    filename = None  # assigning default value for all necessary parameters
    sheetname = None
    start_row = 1
    end_row = None
    key_column = 1
    value_column = 2
    l_args = sys.argv[1:]

    try:
        opts, args = getopt.getopt(l_args, "", ["file=",
                                                "sheetname=",
                                                "start-row=",
                                                "end-row=",
                                                "key-column=",
                                                "value-column="
                                                ])
    except getopt.GetoptError as err_det:
        print_args()
        print("Error in reading parameters:" + str(err_det))
        sys.exit("Wrong parameters - exiting")
    if opts:
        for opt, arg in opts:
            if opt == "--file":
                if not os.path.exists(arg):
                    print(f"Please input the correct filename with path {arg}")
                    sys.exit()
                filename = arg
            elif opt == "--sheetname":
                sheetname = arg
            elif opt == "--start-row":
                start_row = int(arg)
            elif opt == "--end-row":
                end_row = int(arg)
            elif opt == "--key-column":
                key_column = int(arg)
            elif opt == "--value-column":
                value_column = int(arg)
            else:
                print("Please select correct options.")
                print_args()
                sys.exit()
    if filename:
        excel_to_json(filename, sheetname, key_column, value_column, start_row, end_row)
    else:
        print("Please input filename.")
        print_args()


def sheet_to_json(sheet: xlrd.sheet, sheetname: str, key_column, value_column, start_row, end_row):
    if not end_row:  # getting end row if end row is not supplied
        end_row = sheet.nrows
    key_column -= 1  # subtracting 1 to match the python index with excel index
    value_column -= 1
    start_row -= 1
    js = {}
    for row in range(start_row, end_row):
        try:
            key = int(sheet.cell(row, key_column).value * 100)
            value = int(sheet.cell(row, value_column).value * 100)
            js[key] = value
        except Exception as ex:
            print(f"Exception in row {str(row)}: {str(ex)}")
    with open(sheetname+".json", "w")as file:  # using sheetname as filename
        json.dump(js, file, indent=4)
    print(sheetname+".json created successfully.")


def excel_to_json(filename, sheetname, key_column, value_column, start_row, end_row):
    wb = xlrd.open_workbook(filename)
    shts = wb.sheet_names()
    if sheetname:  # if sheetname is supplied then create json file only for that sheet
        if not sheetname in shts:
            print(f"{sheetname} sheet is not in {filename}")
            sys.exit()
        lsheet = wb.sheet_by_name(sheetname)
        sheet_to_json(lsheet, sheetname, key_column, value_column, start_row, end_row)
    else:
        for sht in shts:
            lsheet = wb.sheet_by_name(sht)
            sheet_to_json(lsheet, sht, key_column, value_column, start_row, end_row)
    print("Done.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        args_read()
    else:
        print_args()
