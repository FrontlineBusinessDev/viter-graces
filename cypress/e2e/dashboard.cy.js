describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.visit("/login");

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

    cy.intercept("POST", "**/report-sales-order/read-overdue-payment", {
      statusCode: 200,
      body: {
        data: [
          {
            installment_payment_customer_name: "Carol Williams",
            installment_payment_code_number: "INV-0001",
            installment_payment_due_date: "2026-08-01",
            installment_payment_amount: 1500,
            days_ago: 3,
          },
          {
            installment_payment_customer_name: "Juan Dela Cruz",
            installment_payment_code_number: "INV-0002",
            installment_payment_due_date: "2026-08-05",
            installment_payment_amount: 2500,
            days_ago: 1,
          },
          {
            installment_payment_customer_name: "Robert Samson",
            installment_payment_code_number: "INV-0003",
            installment_payment_due_date: "2026-08-10",
            installment_payment_amount: 500,
            days_ago: 0,
          },
        ],
      },
    }).as("overduePayments");

    cy.visit("/developer/dashboard");

    cy.url().should("include", "/dashboard");

    cy.wait("@activities");
    cy.wait("@overduePayments");
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
      cy.get('[data-testid="timeframe-monthly"]').click();

      cy.get('[data-testid="timeframe-yearly"]').click();
    });
  });

  it("should display overdue payments", () => {
    cy.get('[data-testid="overdue-payments"]').should(
      "contain",
      "Overdue Payments",
    );

    cy.get('[data-testid="overdue-payments"]').should(
      "contain",
      "Carol Williams",
    );
    cy.get('[data-testid="overdue-payments"]').should(
      "contain",
      "Juan Dela Cruz",
    );
    cy.get('[data-testid="overdue-payments"]').should(
      "contain",
      "Robert Samson",
    );

    cy.get('[data-testid="overdue-payment-btn-to-view"]')
      .should("contain", "Click to view")
      .click();
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
      cy.get('[data-testid="timeframeCF-monthly"]').click();

      cy.get('[data-testid="timeframeCF-yearly"]').click();
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
      cy.get('[data-testid="timeframePL-monthly"]').click();

      cy.get('[data-testid="timeframePL-yearly"]').click();
    });
  });
});
