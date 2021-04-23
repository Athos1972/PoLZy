import sys
import getopt
from polzyFunctions.scripts.utils import db, models
from sqlalchemy import func, or_


def print_args():
    print("""    This program is used to add new Notification for specified users & companies in ToastNotification Table
    To update statistics for all companies and users = python AddNotification.py --message <Notification Text>
    Options:
    --message       "<Notification Text>"     Enter message text here. This option is compulsory.

    --company-id    "<id1>, <id2>, <id3>,..." Enter company ids separated by commas here. 
                                              If not supplied notification will be for all companies.
    --user-id       "<id1>, <id2>, <id3>,..." Enter user ids separated by commas here. 
                                              If not supplied notification will be for all users.
    --company-name  "<name1>, <name2>,..."    Enter company name separated by commas here. 
                                              If not supplied notification will be for all companies.
    --user-email    "<email1>, <email2>,..."  Enter user email separated by commas here. 
                                              If not supplied notification will be for all users.
    --type          <badge/default/info...>   Specify toast type badge or default
    
    --duration      <milliseconds>            Enter value in milliseconds. e.g. For 1 second use 1000
                                              Default = 3000
    --horizontal    <left/right>              Horizontal alignment of toast notification. (if type=badge then not valid)
                                              Default = left
    --vertical      <top/bottom>              Vertical alignment of toast notification. (if type=badge then not valid)
                                              Default = top
    
    Note: Make sure to input values of options inside (") double quotes to ignore any error.
    """)


def args_read(l_search_parameter):
    l_args = sys.argv[1:]

    try:
        opts, args = getopt.getopt(l_args, "", ["message=",
                                                "company-id=",
                                                "user-id=",
                                                "company-name=",
                                                "user-email=",
                                                "type=",
                                                "duration=",
                                                "horizontal=",
                                                "vertical="
                                                ])
    except getopt.GetoptError as err_det:
        print("Error in reading parameters:" + str(err_det))
        print_args()
        sys.exit("Wrong parameters - exiting")
    if opts:
        for opt, arg in opts:
            if l_search_parameter == opt:
                return arg
            if "--" + l_search_parameter == opt:
                if arg:
                    return arg
                else:
                    return None
    return None


def sanitize_ids(text):
    if text:
        return [id_.strip() for id_ in str(text).split(",")]
    return None


def get_message():
    message = args_read("message")
    if not message:
        print("\nPlease supply notification text with option --message\n")
        print_args()
        sys.exit()
    return message


def get_company():
    companies = sanitize_ids(args_read("company-id"))
    if not companies:
        companies = []
        names = sanitize_ids(args_read("company-name")) or []
        for name in names:
            company = db.session.query(models.Company).filter(func.lower(models.Company.name) == func.lower(name)).first()
            if company:
                companies.append(company.id)
            else:
                print(f"No company found with name {name}")
    return companies


def get_user():
    users = sanitize_ids(args_read("user-id"))
    if not users:
        users = []
        emails = sanitize_ids(args_read("user-email")) or []
        for email in emails:
            user = db.session.query(models.User).filter(func.lower(models.User.email) == func.lower(email)).first()
            if user:
                users.append(user.id)
            else:
                print(f"No user found with email: {email}")
    return users


def update_notification(message, type, duration, horizontal, vertical, companies=None, users=None):
    models.ToastNotifications.new(message, type=type, duration=duration, horizontal=horizontal,
                                    vertical=vertical, company_ids=companies, user_ids=users)
    print(f"{message}  -- message updated in Notifications table.")


if __name__ == "__main__":
    message = get_message()
    type_ = args_read("type") or "default"
    duration = args_read("duration") or 0  # if no value is passed use 0
    duration = int(duration) or None       # convert 0 to None to get a toast for forever until closed
    horizontal = args_read("horizontal") or "left"
    vertical = args_read("vertical") or "top"
    companies = get_company()
    users = get_user()
    update_notification(
        message=message, type=type_, duration=duration, horizontal=horizontal,
        vertical=vertical, companies=companies, users=users
    )
