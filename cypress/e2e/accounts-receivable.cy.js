describe("Accounts Receivable Module", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    // needs enough columns visible that the horizontal-scroll table still
    // exposes the action column without fighting Cypress's scroll-into-view
    cy.viewport(1920, 900);
    cy.visit("/developer/accounts-receivable");
  });

  it("Loads the accounts receivable report", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );

    cy.wait("@getAccountsReceivable");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  // this page has no add flow - only a per-order payment-recording modal
  // reachable via the row's edit action
  it("Opens the order details modal from the edit action", () => {
    cy.get('[data-testid="table-row"]', { timeout: 15000 })
      .first()
      .within(() => {
        cy.get('[data-testid="action-edit"]').click({ force: true });
      });

    cy.contains("Update Order Details").should("be.visible");

    cy.get('[data-testid="close-btn"]').click();

    cy.contains("Update Order Details").should("not.exist");
  });
});
