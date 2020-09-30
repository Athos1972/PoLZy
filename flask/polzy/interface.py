#
# Policy Management System Interface
#
# Define here the methods to interface with your Policy Management System
#


def fetch_policy(policy_number, effective_date):
    #
    # fetches a policy data by its number and effective date from the Policy Management System 
    # reshapes the fetched data 
    #

    # a sample implementation

    import policy_system
    policy = policy_system.get(policy_number, effective_date)

    # reshape policy if needed 

    return policy