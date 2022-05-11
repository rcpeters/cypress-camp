/// <reference types="cypress" />

export const visitCampsiteList = (campsiteUrl) => {
    // need for figure out a way of dealing with modal not showing
    cy.visit(campsiteUrl);
    cy.get('[aria-label="Close modal"]', { timeout: 1000 })
        .should('be.visible').then((modal) => {
            cy.get('[aria-label="Close modal"]').click();
        })

    // goto campsite list
    cy.get('span.sarsa-button-inner-wrapper:contains("Campsite List")').parent().click();
}

export const checkCampsite = (num) => {
    /*
    see if the button for adding a campsite is active, if so add it

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