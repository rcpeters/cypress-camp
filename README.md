# cypress-camp

**This project is for my personal use.** You are free to fork it but it will not be maintained outside of my personal needs (or you decide to hire me). I would describe many things such as environment variables parsing as brittle.

This was created to help book campsites on the day they are released. It will monitor the campsites and add them to cart. From there you must complete the process. The [Cypress](https://www.npmjs.com/package/cypress) browser testing framework is used for the automation.

## Setup

1. Clone the repo
2. `npm install`

## Example recreation.gov campsite booking

North Pines Yosemite

```
 ./node_modules/.bin/cypress run --headed --browser chrome --spec cypress/integration/campsite-grabber.js --no-exit --env="email=broken_email,password=broken_password,numToBook=4,campsiteId=10067346,campsites=1:2:3,startDate=07/10/2022,endDate=07/12/2022,bookingOpens=2022-05-17T14:40:00"
```

Kirby Cove

```
 ./node_modules/.bin/cypress run --headed --browser chrome --spec cypress/integration/campsite-grabber.js --no-exit --env="email=broken_email,password=broken_password,numToBook=2,campsiteId=232491,campsites=1:3:4,startDate=08/25/2022,endDate=08/28/2022,bookingOpens=2022-05-17T14:40:00"
```
