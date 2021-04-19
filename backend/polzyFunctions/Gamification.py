from polzybackend.models import db, GamificationUserStats, GamificationActivityWeight
from polzyFunctions.GlobalConstants import logger


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class HitList(metaclass=Singleton):
    def __init__(self):
        pass

    def deriveUserRanking(self, user):
        #
        # generate ranking for user
        #

        rank_categories = [
            'daily',
            'weekly',
            'monthly',
            'annual',
            'all time'
        ]

        # Get all gamification statistics for same company
        stats = db.session.query(GamificationUserStats).filter_by(company_id=user.company_id).all()
        ranking_dic = {}

        for rank_category in rank_categories:  # creating response json with rank categories as key
            ranking_dic[rank_category] = self.get_rank_by_category(rank_category, stats)

        # generate and return random ranking
        return ranking_dic

    def get_rank_by_category(self, rank_category, stats):
        # getting weighted points for every activity and adding them up per user
        unadded_user_points = {}
        for stat in stats:  # first getting weighted points of each activity
            try:
                if not stat.user.email in unadded_user_points:
                    unadded_user_points[stat.user.email] = []
            except AttributeError:
                logger.critical(f"User id {stat.user_id} doesn't exist. So ranking is skipping it.")
                continue
            unadded_user_points[stat.user.email].append([stat.get_user_statistics().get(
                rank_category, 0), stat.user.email])

        added_points = []
        for user_email in unadded_user_points:  # adding activity points to one per user
            score = 0
            for points in unadded_user_points[user_email]:
                score += points[0]
            added_points.append([score, user_email])

        last_score = -1
        last_rank = 0
        ranked_data = []
        for dt in sorted(added_points, reverse=True):  # ranking user as per their points
            dic = {}
            if dt[0] != last_score:  # give same rank number if last iteration has same score
                last_rank += 1
                last_score = dt[0]
                dt.append(last_rank)
            else:
                dt.append(last_rank)
            dic['name'] = dt[1]
            dic['operations'] = dt[0]
            dic['rank'] = dt[2]
            ranked_data.append(dic)
        return ranked_data
