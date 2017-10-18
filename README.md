# Canary Technical Interview
In the language of your choice, create an application that reads data from the provided `sites.json` file and uses it respond to requests to a web service.

## Service Requirements
The web service should expose a few specific pieces of functionality.

### Accept a data file
The service should accept a JSON file as input and persist the data contained in the file to your datastore of choice.  The data does not need to be persisted in the same format as the input file.

### Get a list of stations and whether or not they’re in compliance
The compliance ruleset is as follows, based on the data provided:
* All tanks must have the value of their “leaking” flag set to false.
* There must be no High Severity alarms at the site.

### Modify the compliance details of a site
Sometimes, hardware at a site provides bad data. In those cases, we want users to be able to flag a site as "compliant" even if the data in `sites.json` says it is not. This should be persisted so that the next time you request the list of stations, they will be shown as in compliance (with an indicator that the value was changed.)

### Get a list of stations
Allow a user to query the service to get a list of stations

### Get a list of tanks at each station
Allow a user to query the service to get the tanks at a station and whether or not the tanks are currently leaking.

## Delivery requirements
Provide a tarball or zip file with instructions to setup and run the app.
