# Application abstract

Aim of PoLZy is to create a simplified way for agents and employees of insurance companies
to deal with standard business processes during the life cycle of a policy.

PoLZy is not a 100% replacement for a full fledged policy management system, which covers all
kinds of complex business processes, but a fast entry for e.g. 80% of the business processes
that occur frequently and should be dealt with a minimium of effort, for instance:

* Cancellation
* Suspension  
* Reinstatement
* Change of premium payment details (frequency, payment channel)

PoLZy is optimised for fast entry and simple handling of the application, despite the complex
background of operations in the policy mangement system.

PoLZy can be extended easily and provides a report for each product, user channel, etc.
to see, which operations were requested but couln't be executed - thus providing insight into
possible future enhancements for each installation.

## Main business functionality of PoLZy

* Request policy details
* Request information about possible operations on a policy and an effective date
* Request execution of an operation on a policy and effective date
* Request status of an operation

## Main touch points between existing infrastructure and PoLZy

* As an IFrame in an existing portal
* Via API Calls 
* As a stand alone WEB-App including user-management

### Supporting business functions

* Login / Authorize using JWT or OAuth
* Attach Documents to an operation (and forward them to a document mangement system)
* Provide activity list per user, insurance product, business process, backend systems
  and combiniations of those parameters per time unit, e.g. daily.

# Technical abstract
PoLZy is used by remote systems via API-Calls and users via WEB-Frontend. The APIs in the
PoLZy backend are used either directly or from the frontend. PoLZy runs on multiple Docker
images:

* Database of product details (=Mapping), operations, users, customizing settings
* Backend
* Frontend

...gunicorn, nginx for demo purposes also on Docker.

## Non-functional properties
* Swagger/OpenAPI documentation
* Custom exchangeable Stylesheet, for colors and Logos
* Custom exachangeble Header and Footer area (e.g. Contact Info Helpdesk)
* Multilanguage frontend and database customizing entries (all text elements in the database
  include a table for each language. If current language is not found, fall-back to english.
  If english is not found, take first maintained entry)
* ENUMs (from customizing database) in Swagger
* Extensive documentation to enable customer enhancements
* Plugin concept for Backend factories
* Mouse-over with customizable texts for all frontend elements
 
