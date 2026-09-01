describe("Finance Returns Module", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/finance-returns");
  });

  // this is a read-only report over the same data as the standalone
  // Returns module (cypress/e2e/returns.cy.js) - no add/edit/delete here
  it("Loads the finance returns report", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.wait("@getFinanceReturns");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Does not render an add button", () => {
    cy.contains("button", /finance returns/i).should("not.exist");
  });
});
