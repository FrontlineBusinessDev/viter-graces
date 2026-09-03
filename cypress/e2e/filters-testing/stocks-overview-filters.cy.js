describe("Stock Overview - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/stock-overview");
  });

  // STATUS
  it("Filter the Status", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    // in stock
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "in stock")
      .click();

    cy.wait("@getStockOverview");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // low stock
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "low stock")
      .click();

    cy.wait("@getStockOverview");

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  // PRODUCTS
  it("Should filter the product when selecting a name", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getStockOverview");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', productName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  // SKU
  it("Should filter the SKU when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="products_sku"]').type("002");

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="products_sku"]').clear();
  });

  // LOCATIONS
  it("Should filter by location when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="stock_movement_location"]').type("Dolores, Quezon");

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_location"]').clear();
  });

  // CURRENT STOCK
  it("Should filter by min current stock", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="current_qty_min"]').type("10");

    cy.wait("@getStockOverview");
    cy.contains("10").should("exist");

    cy.get('[data-testid="current_qty_min"]').clear();
  });

  it("Should filter by max current stock", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="current_qty_max"]').type("100");

    cy.wait("@getStockOverview");

    cy.get('[data-testid="current_qty_max"]').clear();
  });

  // THRESHOLD
  it("Should filter by min threshold", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="products_low_stock_threshold_min"]').type("10");

    cy.wait("@getStockOverview");
    cy.contains("10").should("exist");

    cy.get('[data-testid="products_low_stock_threshold_min"]').clear();
  });

  it("Should filter by max threshold", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="products_low_stock_threshold_max"]').type("10");

    cy.wait("@getStockOverview");
    cy.contains("10").should("exist");

    cy.get('[data-testid="products_low_stock_threshold_max"]').clear();
  });

  it("Should filter by threshold range", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="products_low_stock_threshold_min"]').type("20");
    cy.get('[data-testid="products_low_stock_threshold_max"]').type("100");

    cy.wait("@getStockOverview");

    cy.get('[data-testid="products_low_stock_threshold_min"]').clear();
    cy.get('[data-testid="products_low_stock_threshold_max"]').clear();
  });

  // UNIT
  it("Should filter the unit when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="products_unit"]').type("pcs");

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="products_unit"]').clear();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getStockOverview");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });

  // SEARCH
  it("Search a product - Mobile", () => {
    cy.viewport(390, 844); // iphone 13 viewport

    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="search-input"]').type("Cassava{enter}");

    cy.wait("@getStockOverview");

    cy.contains("Cassava", { timeout: 1000 }).should("exist");
  });
});
