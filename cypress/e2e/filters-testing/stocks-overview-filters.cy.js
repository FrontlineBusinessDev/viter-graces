describe("Stock Overview - Filters", () => {
     beforeEach(() => {
        cy.session("admin", () => {
            cy.login();
        });
        cy.visit("/developer/stock-overview");
     })

// STATUS
  it("Filter the Status", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    // active
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get("#react-select-3-option-0").click();

    // inactive
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get("#react-select-3-option-1").click();

    cy.get(".react-select__clear-indicator").click();
  });

// PRODUCTS
  it("Should filter the product when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="stock_movement_product_name"]').type("Banana");

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_product_name"]').clear();
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
  it("Should filter the after when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");
    cy.get('[data-testid="stock_movement_location"]').type("Dolores, Quezon");

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_location"]').clear();
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
    cy.get('[data-testid="products_unit"]').type("2");

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="products_unit"]').clear();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get("#react-select-5-option-0").click();

    cy.get(".react-select__clear-indicator").click();
  });

})