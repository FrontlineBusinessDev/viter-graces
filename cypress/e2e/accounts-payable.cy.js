describe("Accounts Payable Module", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.viewport(1920, 900);
    cy.visit("/developer/accounts-payable");
  });

  it("Loads the accounts payable report", () => {
    cy.intercept("POST", "**/finance-account-payable/page/*").as(
      "getAccountsPayable",
    );

    cy.wait("@getAccountsPayable");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  // this page has no add flow - only a per-PO payment-recording modal
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
