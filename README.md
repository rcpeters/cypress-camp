# cypress-camp

**This project is for my personal use.** You are free to fork it but it will not be maintained outside of my personal needs (or you decide to hire me). I would describe many things such as environment variables parsing as brittle.

This was created to help book campsites on the day they are released. It will monitor the campsites and add them to cart. From there you must complete the process. [Cypress](https://www.npmjs.com/package/cypress) browser is used for the automation.

## Example recreation.gov campsite booking

```
 ./node_modules/.bin/cypress run --headed --browser chrome --spec cypress/integration/campsite-grabber.js --no-exit --env="email=broken_email,password=broken_password,numToBook=4,campsiteId=10067346,campsites=1:2:3,startDate=07/10/2022,endDate=07/12/2022"
```
