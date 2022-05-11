/// <reference types="cypress" />
import { visitCampsiteList, checkCampsite } from './helpers/campsite-helpers'
import { establishLoggedIn, populateDates } from './helpers/recreation-gov-helpers'

const campsiteId = Cypress.env('campsiteId');
const campsitesStr = Cypress.env('campsites');
var campsites = campsitesStr.split(':')
const numToBook = Cypress.env('numToBook');
const numBooked = 0;
const email = Cypress.env('email');
const password = Cypress.env('password');
const startDate = Cypress.env('startDate');
const endDate = Cypress.env('endDate');
const maxChecks = 4;
var checks = 0;
const campsiteUrl = `https://www.recreation.gov/camping/campgrounds/${campsiteId}?tab=campsites`


const keepPolling = () => {
    return campsites.length > 0 || numBooked >= numToBook
}

// TODO: make this easier to read
const pollCampsites = () => {
    if (keepPolling)
        cy.wrap(campsites).each((num, i, array) => {
            return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                    if (keepPolling) {
                        checkCampsite(num)
                        if (i >= array.length - 1)
                            if (checks < maxChecks) {
                                checks += 1;
                                cy.reload().then($object => {
                                    pollCampsites();
                                })
                            } else {
                                cy.log("maxChecks reached")
                            }
                    }
                    resolve()
                }, 0)
            })
        })
}


it('loading recreation.gov campsite', () => {
    populateDates(startDate, endDate);
    visitCampsiteList(campsiteUrl);
    establishLoggedIn(email, password);
    pollCampsites();
})


