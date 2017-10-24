# Canary Service
## Instructions for running:
* Download the codebase
* Make sure `yarn` or `npm` is installed
* Run `yarn` or `npm install` to install dependencies
* Run `yarn start` or `npm start`

## API Documentation:
[apiDoc](http://apidocjs.com/) was used to created documentation for the apis.

See https://localhost:3000/doc

## Design Decisions and Technology Choices
### Node & Express
Node and Express are relatively quick to spin up a basic server with little setup. For a relatively simple project like this, I wanted to avoid spending too much time with configuring the web server.

### Database Schema and Design
* `Station` is exposed to the user but is actually referred to and stored as `Site` in the application.
* A `Tank` is assumed to always belong to the same station. Since tanks are physically large and are unlikely to be moved to different gas stations, I didn't feel that I'd need to worry about storing `Tank` objects in a separate document (or table in a relational database). 
  * This is more of a limitation of the provided data but there's no provided way of uniquely identifying a `Tank` object, making it difficult to dedupe `Tank` objects if they were stored by themselves.
  * This also meant that `Tank` objects are a nested property on `Site`. As a result, get/update apis to `Tank` would route through the `Site` that the tank belonged to, which seems logical.
* `Alarm`s are assumed to always belong to a station and not be moved between stations. An alarm is only relevant for the station for which it was created. Similar line of thought as above.
* Compliance override is achieved with the design of the compliance object on a site:
  ```
  compliance: {
    value: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: null }
  }
  ```
  The `lastUpdated` field is initally set to `null`. When the compliance value is manually overridden, `lastUpdated` is updated to the time that action occurs and is used as the indicator.

### MongoDB
Would normally have chosen a relational database (likely `MySQL` or `PostgreSQL`) but with the given dataset, a noSQL database seemed easier for the job. With the decisions from the previous section, the apis specified require little relational querying so a relational database did not seem necessary. If the scope of the project were larger or if significant potential future work were expected, I would certainly consider choosing a relational database. 
* On a related note, the `DAO` class was created to act as a layer on top of the data and model classes, so that if a database switch were necessary, the rest of the control logic would still be referencing the `DAO` and avoid significant refactoring.

## Testing
No unit/integration tests are included. API testing was done manually using Postman/Httpie. Would look to add various levels of tests in the future using tools like Mocha/Chai. Testing would include unit testing functions/methods, integration testing apis and database functions.


---
---
---


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
