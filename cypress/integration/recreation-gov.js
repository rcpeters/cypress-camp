/// <reference types="cypress" />
const campsiteId = Cypress.env('campsiteId');
const campsitesStr = Cypress.env('campsites');
var campsites = campsitesStr.split(':')
const email = Cypress.env('email');
const password = Cypress.env('password');
const startDate = Cypress.env('startDate');
const endDate = Cypress.env('endDate');

const campsiteUrl = `https://www.recreation.gov/camping/campgrounds/${campsiteId}?tab=campsites`

const loginViaUI = (username, password) => {
    cy.get('#ga-global-nav-log-in-link').click();
    cy.get('#email').type(email);
    cy.get('#rec-acct-sign-in-password').type(password);
    cy.get('.rec-acct-sign-in-btn').click();
    cy.get('form').submit();
}

function reloadPageUntilDateReleased(maxAttempts = 10, attempts = 0) {
    if (attempts >= maxAttempts)
        throw new Error("Max Attempts reached")
    cy.get('#campground-start-date-calendar').type('05/08/2022');
    cy.get('#campground-end-date-calendar').type('05/10/2022');
    cy.get("#campground-start-date-calendar-error").then($table => {
        if ($table.children().length > 0) {  // do your condition check synchronously
            cy.wait(750);
            cy.reload();
            setImmediate(reloadPageUntilDateReleased(maxAttempts, attempts + 1))
        }
    })
}

/*
different button states
<button data-component="Button" type="button" class="sarsa-button list-map-book-now-button-tracker desktop sarsa-button-primary sarsa-button-xs" id="book-now-button-10067349" aria-label="Add Site: Site 3, Loop: Haypress Campground to cart" target="_blank" rel="noopener noreferrer"><span class="sarsa-button-inner-wrapper"><span class="sarsa-button-content">Add to Cart</span></span></button>
<button data-component="Button" type="button" disabled="" class="sarsa-button sarsa-button-tertiary-alt sarsa-button-xs sarsa-button-disabled" id="disabled-button-10067347" aria-label="Partially Available for Site: Site 1, Loop: Haypress Campground"><span class="sarsa-button-inner-wrapper"><span class="sarsa-button-content">Partially Available</span></span></button>
<button data-component="Button" type="button" disabled="" class="sarsa-button sarsa-button-tertiary-alt sarsa-button-xs sarsa-button-disabled" id="disabled-button-579" aria-label="Unavailable for Site: 101, Loop: North Pines"><span class="sarsa-button-inner-wrapper"><span class="sarsa-button-content">Unavailable</span></span></button>
*/

const checkSite = (num) => {
    cy.get('#campsite-filter-search').clear();
    cy.get('#campsite-filter-search').type(num);
    cy.get('[aria-label*="Add Site:"],[aria-label*="Partially Available for Site:"],[aria-label*="Unavailable for Site:"]').then($button => {
        $button.text()
        cy.log($button.text());
    })

    /*
    cy.get('.rec-flex-card-duration:contains("Check back on")').then($span => {
        cy.log(`Check back on site ${num} `);
    })
    */

}

it('loading recreation.gov campsite', () => {
    /* 
       Visit main page first to set dates, this 
       will let you set dates even when a specific campsite isn't
       available for those dates. Examples include not released 
       campsites. At the time this was written going directly 
       to the campsite page would not let you do this.
    */
    cy.visit('https://www.recreation.gov/');
    cy.get('#gtm-homepage-search-tab-1').click();
    cy.get('#startDate').type(startDate);
    cy.get('#endDate').type('{backspace}');
    cy.get('#endDate').type(endDate);
    cy.get('#gtm-camping-lodging-hero-search').click();

    cy.visit(campsiteUrl);
    cy.get('[aria-label="Close modal"]', { timeout: 1000 })
        .should('be.visible').then((modal) => {
            cy.get('[aria-label="Close modal"]').click();
        })

    // goto campsite list
    cy.get('span.sarsa-button-inner-wrapper:contains("Campsite List")').parent().click();


    //loginViaUI(email, password);

    cy.wrap([1, 2, 3]).each((num, i, array) => {
        return new Cypress.Promise((resolve) => {
            setTimeout(() => {
                checkSite(num)
                resolve()
            }, num)
        })
    })

    //    reloadPageUntilDateReleased()

    // const jqElement = $('#campground-start-date-calendar-error')
    // cy.log(jqElement)
})


