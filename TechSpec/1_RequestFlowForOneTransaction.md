# Request flow (API and WEB)

## Info request
1: -> GetPolicyDetails (Policy#, EffectiveDate (Default=Today))  
2: <- Policy details 
  * List of Attributes, Attribute type descriptions and values
  * List of possible activities (e.g. cancellation, suspension, change premium payer), Required attributes for each activity, 
    attribute types, requirement status (mandatory, optional), default value for each attribute
    
## Activity request
1: -> ExecuteActivity (Activity, Attributes + values as per previous answer)  
2: <- ActivityReferenceID, Status (Accepted | Processed | Rejected), MessageLog

## ActivityStatusRequest
1: -> ActivityID  
2: <- Status, MessageLog

# Request flow Backend

## GetPolicyDetails

Processing (custom specific code):
* Identify source system
* Request Authorization
* ReadPolicyData
  * Read Partner data (optional)
  * Read Commission contract data (optional)
  * Read insured object data (optional)
  * Read or derive data of possible activities
    * Build attribute list for each activity
  * Cache all data objects for later use
* Map external data into common format
* Return payload

## ActivityRequest

Processing (custom specific code):
* Generate UUID
* Store input in database
* Identify source system
* Request Authorization
* Read cached data from GetPolicyDetails
* Check input (optional and mandatory fields. No additional attributes, that can't be mapped)
* Either return "Accepted" or "Rejected"
* Map to source system adapter (e.g. REST, SOAP, RFC, RPC, etc.)
* Execute source system call (synchronous or async)

## ActivityStatusRequest

Processing: 
* Read status + message log from DB
* Return result to sender
