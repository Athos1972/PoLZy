#
# available policy statuses with corresponded possible activities 
#

activities_by_status = {
    'active': [
        'cancel',
        'suspend',
    ],
    'canceled': [],
    'suspended': [
        're-activate'
    ],
}