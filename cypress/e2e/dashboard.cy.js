describe("Dashboard", () => {
  beforeEach(() => {
    // Login first
    cy.visit("/portal/login");

    cy.get('input[name="user_account_email"]').type(Cypress.env("email"));

    cy.get('input[name="password"]').type(Cypress.env("password"));

    cy.get('button[type="submit"]').click();

    // Verify login success
    cy.url().should("not.include", "/login");

    // Go to dashboard
    cy.visit("/portal/developer/dashboard");
  });

  it("should display dashboard page", () => {
    cy.url().should("include", "/dashboard");
  });

  it("should display Sales Today card", () => {
    cy.contains("Sales Today").should("be.visible");

    cy.contains("Yesterday:").should("exist");
  });

  it("should display Low Stock Alerts card", () => {
    cy.contains("Low Stock Alerts").should("be.visible");

    cy.contains("products below threshold").should("exist");
  });

  it("should display Top Selling Product card", () => {
    cy.contains("Top Selling Product").should("be.visible");
  });

  it("should display Expenses Today card", () => {
    cy.contains("Expenses Today").should("be.visible");
  });

  it("should display Sales Overview section", () => {
    cy.contains("Sales Overview").should("exist");
  });

  it("should display Overdue Payments section", () => {
    cy.contains("Overdue Payments").should("exist");
  });

  it("should display Recent Activities section", () => {
    cy.contains("Recent Activities").should("exist");
  });

  it("should display Cashflow Chart", () => {
    cy.get("canvas").should("exist");
  });

  it("should display Profit & Loss Chart", () => {
    cy.get("canvas").should("have.length.at.least", 2);
  });

  it("should load all dashboard widgets", () => {
    cy.contains("Sales Today").should("exist");
    cy.contains("Low Stock Alerts").should("exist");
    cy.contains("Top Selling Product").should("exist");
    cy.contains("Expenses Today").should("exist");
  });
});
