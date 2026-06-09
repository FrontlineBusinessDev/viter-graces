describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.visit("/portal/login");

      cy.get("input[name=user_account_email]").type(Cypress.env("email"));

      cy.get("input[name=password]").type(Cypress.env("password"));

      cy.get("button[type=submit]").click();

      cy.url().should("not.include", "/login");
    });

    cy.intercept("POST", "**/rest/v1/activity/read-with-limit", {
      statusCode: 200,
      body: {
        data: [
          {
            activity_log_user_name: "John Doe",
            activity_log_action: "created",
            activity_log_menu: "sales",
            activity_log_user_role: "admin",
            days_ago: 0,
            type: "sales",
          },
        ],
      },
    }).as("activities");

    cy.visit("/portal/developer/dashboard");

    cy.url().should("include", "/dashboard");

    cy.wait("@activities");
  });

  it("should load dashboard successfully", () => {
    cy.get('[data-testid="dashboard-page"]').should("exist");
  });

  it("should load dashboard successfully", () => {
    cy.get('[data-testid="dashboard-page"]').should("exist");
  });

  it("should display all stat cards", () => {
    cy.get('[data-testid="sales-today-card"]').should("contain", "Sales Today");

    cy.get('[data-testid="low-stock-card"]').should(
      "contain",
      "Low Stock Alerts",
    );

    cy.get('[data-testid="top-selling-card"]').should(
      "contain",
      "Top Selling Product",
    );

    cy.get('[data-testid="expenses-card"]').should("contain", "Expenses Today");
  });

  it("should display sales overview section", () => {
    cy.get('[data-testid="sales-overview"]').should(
      "contain",
      "Sales Overview",
    );
  });

  it("should switch sales overview timeframe", () => {
    cy.get('[data-testid="sales-overview"]').within(() => {
      cy.contains("button", "Monthly").click();

      cy.contains("Monthly");

      cy.contains("button", "Yearly").click();

      cy.contains("Yearly");
    });
  });

  it("should display overdue payments", () => {
    cy.get('[data-testid="overdue-payments"]').should(
      "contain",
      "Overdue Payments",
    );

    cy.contains("Carol Williams");
    cy.contains("Juan Dela Cruz");
    cy.contains("Robert Samson");
  });

  it("should display recent activities section", () => {
    cy.get('[data-testid="recent-activities"]').should(
      "contain",
      "Recent Activities",
    );
  });

  it("should display cashflow chart", () => {
    cy.get('[data-testid="cashflow-chart"]').should("contain", "Cashflow");
  });

  it("should switch cashflow timeframe", () => {
    cy.get('[data-testid="cashflow-chart"]').within(() => {
      cy.contains("button", "Monthly").click();

      cy.contains("button", "Yearly").click();
    });
  });

  it("should display profit and loss chart", () => {
    cy.get('[data-testid="profit-loss-chart"]').should(
      "contain",
      "Profit & Loss",
    );
  });

  it("should switch profit and loss timeframe", () => {
    cy.get('[data-testid="profit-loss-chart"]').within(() => {
      cy.contains("button", "Monthly").click();

      cy.contains("button", "Yearly").click();
    });
  });
});
