PoLZy Back-End Application
==========================

PoLZy back-end will be implemented as a Flask API application. It accepts and returns data as JSON objects.

End-Points
----------

### Authentication

The authentication is implemented with an OAuth Provider. There are 2 authentication end-points.

#### Registration
Connects user accounts on OAuth Provider's service with PoLZy. As a result, a user will be created in PoLZy database.

#### Authorization
A registered user requests an `access token`. The `access token` is used in HTTP Authentication header as follow:
```
Authorization: Bearer access_token
```
The life-time of an access token is 24 hours.

### Requests

#### Get Policy Details
Takes Policy Number as a part of request URL:
```
GET: /policy/{policy_number}
```
Returns 200 with JSON object comprising all the details of the requested Policy.  
Returns 404 if the Policy is not found. 

#### Create Activity
Takes JSON object with the Activity Details:
```
POST: /activity

Request body:
{
	'type': 'activity_type',
	(optional parameters) 
}
```
Creates activity instance in DB and returns 202 with Activity ID.
Returns 404 if the activity cannot be created.

#### Get Activity Status
Takes Activity ID as a part of request URL:
```
GET: /activity/{activity_id}
```
Returns 200 with JSON object comprising activity status
Returns 404 if the Activity is not found.

Activities Implementation
-------------------------

The Activities execute internal app methods based on the specific activity type. 

#### Create Policy
* Triggered by an Activity of type `CreatePolicy`  
* Creates a Policy instance  

#### Update Policy
* Triggered by an Activity of type `UpdatePolicy`  
* Updates the Policy instance  

#### Add Insurance Object
* Triggered by an Activity of type `AddInsuranceObject`  
* Creates an Insured Person or Insured Object instance  
* Adds the created instance to the specified Policy instance  

#### Add Partner
* Triggered by an Activity of type `AddPartner`  
* Get the Partner from DB  
* Creates a Partner instance if the Partner is not found   
* Adds the Partner to the specified Policy or Insured Person instance

