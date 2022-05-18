/// <reference types="cypress" />
import { visitCampsiteList, checkCampsite } from './helpers/campsite-helpers';
import {
    establishLoggedIn,
    populateDates,
    continueShopping,
} from './helpers/recreation-gov-helpers';

const campsiteId = Cypress.env('campsiteId');
const campsitesStr = Cypress.env('campsites');
let campsites = campsitesStr.split(':');
const numToBook = Cypress.env('numToBook');
let numBooked = 0;
const email = Cypress.env('email');
const password = Cypress.env('password');
const startDate = Cypress.env('startDate');
const endDate = Cypress.env('endDate');
const maxChecks = 2000;
let checks = 0;
const campsiteUrl = `https://www.recreation.gov/camping/campgrounds/${campsiteId}?tab=campsites`;

const bookingOpens = Date.parse(Cypress.env('bookingOpens'));

const keepPolling = () => campsites.length > 0 && numBooked < numToBook;

const postAddSiteFn = (siteNum) => {
    numBooked += 1;
    campsites = campsites.filter((site) => site != siteNum);
    cy.log(`Site ${siteNum} added`);
    cy.log(campsites);
    if (keepPolling()) {
        continueShopping();
        populateDates(startDate, endDate);
        visitCampsiteList(campsiteUrl);
    }
};

// TODO: make this easier to read
const pollCampsites = () => {
    cy.wrap(campsites).each((num, i, array) => {
        if (keepPolling()) {
            return new Cypress.Promise((resolve) => {
                setTimeout(() => {
                    checkCampsite(num, postAddSiteFn);
                    if (i >= array.length - 1) {
                        if (checks < maxChecks) {
                            checks += 1;
                            cy.reload().then(($object) => {
                                pollCampsites();
                            });
                        } else {
                            cy.log('maxChecks reached');
                        }
                    }
                    resolve();
                }, 0);
            });
        }
        return false; // return false stops the each iteration
    });
};

it('loading recreation.gov campsite', () => {
    cy.log(Cypress.env('bookingOpens'));
    cy.log(Date.parse(Cypress.env('bookingOpens')));
    populateDates(startDate, endDate);
    visitCampsiteList(campsiteUrl, true);
    establishLoggedIn(email, password);
    cy.log(bookingOpens - Date.now());

    cy.wait(-1000000).then(() => {
        pollCampsites();
    });
});
