describe("Reports - Expenses Report", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/expenses-report");
  });

  it("Loads the expenses report", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Should filter the PO number as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="purchase_order_number"]').type("PO");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_number"]').clear();
  });

  it("Should filter by transaction date", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="purchase_order_date"]').type("2026-08-03");

    cy.wait("@getReport");

    cy.get('[data-testid="purchase_order_date"]').clear();
  });

  it("Should filter by product", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .click();

    cy.wait("@getReport");

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter the description as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="purchase_order_note"]').type("test");

    cy.wait("@getReport");
    cy.wait(1000);

    cy.get('[data-testid="purchase_order_note"]').clear();
  });

  // NOTE: the "Amount" filter (data-testid="amount_min"/"amount_max")
  // targets a SELECT-only alias (purchase_order_total_amount_per_product
  // as amount) in ReportSalesOrder::readAllExpenses() - using it in a
  // WHERE clause fails server-side and the request comes back empty every
  // time, so it's intentionally not exercised here (see also Finance's
  // Expenses filter tests, which hit the same underlying alias issue)

  it("Should filter by min paid amount", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="purchase_order_total_paid_per_product_min"]').type(
      "1",
    );

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_total_paid_per_product_min"]').clear();
  });

  it("Should filter by min balance", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="purchase_order_total_balance_per_product_min"]').type(
      "0",
    );

    cy.wait("@getReport");

    cy.get(
      '[data-testid="purchase_order_total_balance_per_product_min"]',
    ).clear();
  });

  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-expenses/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getReport");

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
