describe("Reports - Low Stock", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/low-stock");
  });

  it("Loads the low stock report", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Does not render a price column", () => {
    cy.contains("th", "Price").should("not.exist");
  });

  it("Should filter by product", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );

    // pick a product known to be below its low-stock threshold rather
    // than an arbitrary active product, which may not be low on stock
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains(".react-select__option", "test product")
      .click();

    cy.wait("@getReport");

    cy.contains('[data-testid="table-row"]', "test product").should(
      "exist",
    );

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by min current stock", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="current_qty_min"]').type("0");

    cy.wait("@getReport");

    cy.get('[data-testid="current_qty_min"]').clear();
  });

  it("Should filter by min threshold", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="products_low_stock_threshold_min"]').type("1");

    cy.wait("@getReport");

    cy.get('[data-testid="products_low_stock_threshold_min"]').clear();
  });

  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
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
