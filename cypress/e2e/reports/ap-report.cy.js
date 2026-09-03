describe("Reports - Accounts Payable Report", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/AP-report");
  });

  it("Loads the AP report", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Should filter the PO number as the user types", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");

    cy.get('[data-testid="purchase_order_number"]').type("PO");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_number"]').clear();
  });

  it("Should filter by product", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .click();

    cy.wait("@getReport");

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter the supplier as the user types", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");

    cy.get('[data-testid="purchase_order_supplier_name"]').type("ZZZNOTREAL");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("not.exist");

    cy.get('[data-testid="purchase_order_supplier_name"]').clear();
  });

  it("Should filter by purchase date", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");

    cy.get('[data-testid="purchase_order_date"]').type("2026-08-14");

    cy.wait("@getReport");

    cy.get('[data-testid="purchase_order_date"]').clear();
  });

  it("Should filter by min balance", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");
    cy.get('[data-testid="purchase_order_total_balance_per_product_min"]').type(
      "1",
    );

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="purchase_order_total_balance_per_product_min"]',
    ).clear();
  });

  it("Should filter the note as the user types", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
    ).as("getReport");

    cy.get('[data-testid="purchase_order_note"]').type("test");

    cy.wait("@getReport");
    cy.wait(1000);

    cy.get('[data-testid="purchase_order_note"]').clear();
  });

  it("Should filter by product owner", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-account-payable/page/*",
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
