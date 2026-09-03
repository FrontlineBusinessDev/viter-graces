describe("Reports - Accounts Receivable Report", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/AR-report");
  });

  it("Loads the AR report", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Should filter by status", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "paid")
      .click();

    cy.wait("@getReport");

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter the order number as the user types", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    cy.get('[data-testid="sales_order_number"]').type("ORD");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_number"]').clear();
  });

  it("Should filter by date", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    cy.get('[data-testid="sales_order_date"]').type("2026-08-14");

    cy.wait("@getReport");

    cy.get('[data-testid="sales_order_date"]').clear();
  });

  it("Should filter by customer", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getReport");

        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-customer"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by product", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    // pick a product known to have an outstanding balance rather than an
    // arbitrary active product, which may have none
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains(".react-select__option", "Cassava chips")
      .click();

    cy.wait("@getReport");

    cy.contains('[data-testid="table-row"]', "Cassava chips").should(
      "exist",
    );

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by min paid", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");
    cy.get('[data-testid="sales_order_paid_per_product_min"]').type("0");

    cy.wait("@getReport");

    cy.get('[data-testid="sales_order_paid_per_product_min"]').clear();
  });

  it("Should filter the payment method as the user types", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

    cy.get('[data-testid="sales_order_payment_method"]').type("cash");

    cy.wait("@getReport");
    cy.wait(1000);

    cy.get('[data-testid="sales_order_payment_method"]').clear();
  });

  it("Should filter by min balance", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");
    cy.get('[data-testid="sales_order_balance_per_product_min"]').type("1");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_balance_per_product_min"]').clear();
  });

  it("Should filter by product owner", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-receivable/page/*",
    ).as("getReport");

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
