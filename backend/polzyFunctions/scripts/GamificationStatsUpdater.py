
import io
import sys
from time import sleep
from datetime import datetime
from polzyFunctions.scripts.utils import db, models
from polzybackend.models import GamificationActivity, GamificationUserStats


save_stdout = sys.stdout  # saves original stdout
sys.stdout = io.StringIO()  # using dummy handler for stdout
from config import Config  # This command throws a print statement therefore using dummy stdout handler
sys.stdout = save_stdout  # restoring original stdout handler



def print_args():
    print("""    This program is used to update Gamification Statistics with unprocessed Events Stored in GamificationActivity Table
    To update statistics in a loop with a predifined process sleep time   = python GamificationStatsUpdater.py --sleep <time in seconds>
    To update statistics only for one time = python GamificationStatsUpdater.py --sleep 0""")


def get_activites():
    """
    Returns unprocessed gamification Activities.
    :return:
    """
    activites = []
    processed = 0
    for activity in db.session.query(GamificationActivity).all():
        if not activity.is_processed:
            activites.append(activity)
        else:
            processed += 1
    print(f'Total activites are {str(processed + len(activites))} out of which {str(processed)} are already processed'
          f' and {str(len(activites))} are ready to be processed.')
    return activites


def update_statistics():
    """
    Updates unprocessed statistics
    :param seconds: Time in seconds for sleep before rerun loop
    :return:
    """
    activites = get_activites()
    users = set()  # using set in order to get count of unique users at the end
    done = 0
    total = len(activites)
    for activity in activites:
        user_id = GamificationUserStats.create_or_update_row(activity, commit=False)  # creates or updates user stats
        if not user_id:  # if user_stats has none objects that means event type is to be ignored
            print(f"Activity {activity.id} skipped because of ignored event type.")
            activity.set_processed(commit=False)  # sets activity as processed
            continue
        users.add(user_id)
        activity.set_processed(commit=False)
        done += 1
        if done % 100 == 0:
            print(f"{done}/{total}")
    GamificationUserStats.commit()
    print(f"Total {str(len(activites))} activities updated for {str(len(users))} unique users.")


def run_loop(seconds=0):
    exceptions = 0
    excpetion_threshold = 100
    while True:
        try:
            update_statistics()
            exceptions = 0
        except Exception as ex:
            exceptions += 1
            print(f"Exception {str(exceptions)}: {str(ex)}")
            logger.exception(f"Exception {str(exceptions)}: {str(ex)}")
            if exceptions >= excpetion_threshold:
                print(f'Exiting loop as total continuous exceptions has reached threshold {str(excpetion_threshold)}')
                sys.exit()
        if not seconds:  # if seconds is 0 then we not need to run this program in loop
            break
        else:
            print(f"Sleeping for {str(seconds)} seconds. Statistics database updated at",
                  datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
            sleep(seconds)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_args()
        update_statistics()
    elif "sleep" in sys.argv[1] and len(sys.argv) > 2:
        try:
            seconds = int(sys.argv[2])
        except:
            print("Integer value needed for sleep. e.g. python GamificationStatsUpdater.py --sleep 10")
            sys.exit()
        run_loop(seconds)
    else:
        print_args()
