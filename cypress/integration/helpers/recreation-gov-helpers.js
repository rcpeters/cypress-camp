/// <reference types="cypress" />

export const establishLoggedIn = (email, password) => {
    /*
      verify logged in by button state, if not logged in do so 
      
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
        }
    })
}

export const continueShopping = () => {
    cy.get('button:contains("Continue Shopping")').should('be.visible');
}

export const populateDates = (startDate, endDate) => {
    /* 
       Visit search page to first to set dates, this 
       will let you set dates even when a specific campsite isn't
       yet available for those dates. Examples include not released 
       campsites. At the time this was written going directly 
       to the campsite page would not let you set unavailable dates.
    */
    cy.visit('https://www.recreation.gov/search');
    cy.get('#startDate').type(startDate);
    cy.get('#endDate').type('{backspace}');
    cy.get('#endDate').type(endDate);
    // make sure the page loads before letting other cy commands proceed
    cy.get('.search-pagination-text:contains("results of")');
}
