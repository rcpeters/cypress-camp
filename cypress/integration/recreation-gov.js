/// <reference types="cypress" />
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

const establishLoggedIn = (username, password) => {
    /* 
      different login button states
      <button class="nav-header-button" aria-label="Log In" id="ga-global-nav-log-in-link">Log In</button>
      <button class="rec-select " title="My Account" aria-label="My Account"><span class="rec-select-profile-photo data-hj-suppress"><div class="rec-account-default-icon "><svg data-component="Icon" class="sarsa-icon rec-icon-account-circle" viewBox="0 0 24 24" role="presentation" focusable="false" height="24" width="24"><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></g></svg></div></span><span class="rec-select-label data-hj-suppress">Rob P.</span><span class="rec-select-icon"><svg data-component="Icon" class="sarsa-icon rec-icon-arrow-down" viewBox="0 0 24 24" role="presentation" focusable="false" height="24" width="24"><g><path d="M7 10l5 5 5-5z"></path></g></svg></span></button>
    */

    cy.get('[aria-label="Log In"],[aria-label="My Account"]').then($button => {
        cy.log($button.text())
        if ($button.text() === "Log In") {
            $button.trigger('click');
            cy.get('#email').type(email);
            cy.get('#rec-acct-sign-in-password').type(password);
            cy.get('.rec-acct-sign-in-btn').click();
            cy.get('form').submit();
        }
    })
}

const checkCampsite = (num) => {
    /*
    different campsite button states
    <button data-component="Button" type="button" class="sarsa-button list-map-book-now-button-tracker desktop sarsa-button-primary sarsa-button-xs" id="book-now-button-10067349" aria-label="Add Site: Site 3, Loop: Haypress Campground to cart" target="_blank" rel="noopener noreferrer"><span class="sarsa-button-inner-wrapper"><span class="sarsa-button-content">Add to Cart</span></span></button>
    <button data-component="Button" type="button" disabled="" class="sarsa-button sarsa-button-tertiary-alt sarsa-button-xs sarsa-button-disabled" id="disabled-button-10067347" aria-label="Partially Available for Site: Site 1, Loop: Haypress Campground"><span class="sarsa-button-inner-wrapper"><span class="sarsa-button-content">Partially Available</span></span></button>
    <button data-component="Button" type="button" disabled="" class="sarsa-button sarsa-button-tertiary-alt sarsa-button-xs sarsa-button-disabled" id="disabled-button-579" aria-label="Unavailable for Site: 101, Loop: North Pines"><span class="sarsa-button-inner-wrapper"><span class="sarsa-button-content">Unavailable</span></span></button>
    */

    cy.get('#campsite-filter-search').clear();
    cy.get('#campsite-filter-search').type(num);
    cy.get('[aria-label*="Add Site:"],[aria-label*="Partially Available for Site:"],[aria-label*="Unavailable for Site:"]').then($button => {
        $button.text()
        cy.log($button.text());
    })

}

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


const populateDates = () => {
    /* 
       Visit main page first to set dates, this 
       will let you set dates even when a specific campsite isn't
       yet available for those dates. Examples include not released 
       campsites. At the time this was written going directly 
       to the campsite page would not let you do this.
    */
    cy.visit('https://www.recreation.gov/');
    cy.get('#gtm-homepage-search-tab-1').click();
    cy.get('#startDate').type(startDate);
    cy.get('#endDate').type('{backspace}');
    cy.get('#endDate').type(endDate);
    cy.get('#gtm-camping-lodging-hero-search').click();
}

const visitCampsiteList = () => {
    // need for figure out a way of dealing with modal not showing
    cy.visit(campsiteUrl);
    cy.get('[aria-label="Close modal"]', { timeout: 1000 })
        .should('be.visible').then((modal) => {
            cy.get('[aria-label="Close modal"]').click();
        })

    // goto campsite list
    cy.get('span.sarsa-button-inner-wrapper:contains("Campsite List")').parent().click();
}


it('loading recreation.gov campsite', () => {
    populateDates();
    visitCampsiteList();
    establishLoggedIn(email, password);
    pollCampsites();

})


