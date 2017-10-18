# Canary Technical Interview
In the language of your choice, create an application that reads data from the provided `sites.json` file and uses it respond to requests to a web service. The web service should expose a few specific pieces of functionality:

### Get a list of stations and whether or not they’re in compliance
The compliance ruleset is as follows, based on the data provided:
* All tanks must have the value of their “leaking” flag set to false.
* There must be no High Severity alarms at the site.

### Modify the compliance details of a site
Sometimes, hardware at a site provides bad data. In those cases, we want users to be able to flag a site as "compliant" even if the data in `sites.json` says it is not. This should be persisted so that the next time you request the list of stations, they will be shown as in compliance (with an indicator that the value was changed.)

### Get a list of tanks at a station, and whether or not they are leaking.

