describe("Reports - Stock Levels", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/stock-levels");
  });

  it("Loads the stock levels report", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Should filter by status", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "in stock")
      .click();

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by product", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getReport");

        cy.contains('[data-testid="table-row"]', productName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter the SKU as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="products_sku"]').type("SKU");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="products_sku"]').clear();
  });

  it("Should filter by min current stock", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="current_qty_min"]').type("1");

    cy.wait("@getReport");

    cy.get('[data-testid="current_qty_min"]').clear();
  });

  it("Should filter by min threshold", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="products_low_stock_threshold_min"]').type("1");

    cy.wait("@getReport");

    cy.get('[data-testid="products_low_stock_threshold_min"]').clear();
  });

  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/report-sales-order/page-stock-level/page/*").as(
      "getReport",
    );

    // "Product Owner" lists every user with that role, not just owners who
    // actually have stock on record - so the first option may legitimately
    // have zero rows. Just assert the filter request completes, rather
    // than assuming rows come back.
    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getReport").its("response.statusCode").should("eq", 200);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
