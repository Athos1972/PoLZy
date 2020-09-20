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
background of operations in the policy management system.

Typical users of PoLZy include clerks in insurance companies, agents in the field, clerks in the
backoffice of agencies. Their aim is to finish processing of a standard process on a policy with
as little possible interaction with the system in the least possible time in order to process a high
volumn per person and per time slice.

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
PoLZy backend are used either directly by a remote system or from the WEB-frontend. PoLZy runs on multiple Docker
images:

* Database of product details (=Mapping), operations, users, customizing settings
* Backend (1..n instances)
* Frontend (1..n instances)

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

## Technical integration

System landscape of insurance company may be complex and large-scale with different backend
policy management systems. It doesn't add any value to present this complexity to the outside
world. PoLZy acts as a proxy and translator for simple business processes into this complex
landscape.

The general approach is to have a functional data model (e.g. Policy, Partner, Agent, Insured
Risk, etc. including all relevant attributes) and use standard API-Calls to enable the outside world (remote systems, 
Web-Frontend) to use these standardized terms to express a functional need. 

Then translate (via custom code for each system) this functional need into a technical interface call (e.g. REST,
SOAP, RFC, RPC, etc.) and provide answers again in functional terms (translated again from the reply of the internal
system via custom code).

For some popular systems (e.g. SAP FS-PM) we provide standard implementations as guidance, but each implementation of
a customer will need adjustments.

## Functional classes

### Policy
* Policy-Number
* Product line (e.g. Car, Life, P&C, Health)
* Remote System
* Current status
* Current date
* Insured Partner (Reference to Partner record)
* Premium Payer (Reference to Partner record)
* Insured Object (Rerefence to Insured Object record)

### Partner
* The usual fields you'd expect for person or company records
* Custom implementations of additional fields (e.g. Risk Group, Current occupation, Previous occupations, 
  Sports, details about health condition)

### Insured Object
* Type (Person | Object)
* If Person --> Link to Partner record
* Additional attributes for each object type
 
