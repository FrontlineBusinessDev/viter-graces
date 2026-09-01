describe("Cash Sales Module", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/cash-sales");
  });

  // this is a read-only report (derived from cash-paid Sales Orders) -
  // there is no add/edit/delete flow to test here
  it("Loads the cash sales report", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");

    cy.wait("@getCashSales");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Does not render an add button", () => {
    cy.contains("button", /cash sales/i).should("not.exist");
  });
});
