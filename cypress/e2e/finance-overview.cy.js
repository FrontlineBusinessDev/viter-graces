describe("Finance Overview Module", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/finance-overview");
  });

  it("Loads the finance stats", () => {
    cy.contains("Total Revenue").should("be.visible");
    cy.contains("Total Expenses").should("be.visible");
    cy.contains("Net Profit").should("be.visible");
    cy.contains("Unpaid / Overdue").should("be.visible");
  });

  it("Renders the revenue vs expenses vs profit chart with a timeframe toggle", () => {
    cy.contains("Revenue vs Expenses vs Profit").should("be.visible");

    cy.contains("button", "weekly").should("be.visible").click();
    cy.contains("button", "monthly").should("be.visible").click();
    cy.contains("button", "yearly").should("be.visible").click();
  });

  it("Navigates to each finance sub-page", () => {
    cy.contains("a", "cash sales").click();
    cy.url().should("include", "/cash-sales");

    cy.visit("/developer/finance-overview");
    cy.contains("a", "accounts receivable").click();
    cy.url().should("include", "/accounts-receivable");

    cy.visit("/developer/finance-overview");
    cy.contains("a", "expenses").click();
    cy.url().should("include", "/expenses");

    cy.visit("/developer/finance-overview");
    cy.contains("a", "accounts payable").click();
    cy.url().should("include", "/accounts-payable");

    cy.visit("/developer/finance-overview");
    cy.contains("a", "sales journal").click();
    cy.url().should("include", "/sales-journal");

    cy.visit("/developer/finance-overview");
    cy.contains("a", "finance returns").click();
    cy.url().should("include", "/finance-returns");
  });
});
