describe("Sales Journal Module", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/sales-journal");
  });

  // this is a read-only ledger, populated as a side effect of sales/AR/AP
  // payments - there is no add/edit/delete flow to test here
  it("Loads the sales journal", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );

    cy.wait("@getSalesJournal");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Does not render an add button", () => {
    cy.contains("button", /sales journal/i).should("not.exist");
  });
});
