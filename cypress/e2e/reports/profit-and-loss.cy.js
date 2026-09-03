describe("Reports - Profit & Loss", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    // no data-testid on this page's controls - navigate with the literal
    // "&" the route uses rather than an encoded path
    cy.visit("/developer/profit-&-loss");
  });

  it("Loads the profit and loss statement", () => {
    cy.intercept("POST", "**/report-sales-order/read-profite-and-loss").as(
      "getProfitLoss",
    );

    cy.wait("@getProfitLoss");

    cy.contains("Gross Sales").should("be.visible");
    cy.contains("Net Sales").should("be.visible");
    cy.contains("Operating Expenses").should("be.visible");
    cy.contains("Net Income").should("be.visible");
  });

  it("Refetches when the date range changes", () => {
    cy.intercept("POST", "**/report-sales-order/read-profite-and-loss").as(
      "getProfitLoss",
    );

    cy.wait("@getProfitLoss");

    cy.get('input[type="date"]').eq(0).type("2026-08-01");

    cy.wait("@getProfitLoss");

    cy.get('input[type="date"]').eq(1).type("2026-08-31");

    cy.wait("@getProfitLoss");
  });

  it("Refetches when a product owner is selected", () => {
    cy.intercept("POST", "**/report-sales-order/read-profite-and-loss").as(
      "getProfitLoss",
    );

    cy.wait("@getProfitLoss");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getProfitLoss");
  });
});
