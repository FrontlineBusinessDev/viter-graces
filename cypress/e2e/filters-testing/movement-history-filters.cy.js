describe("Movement History Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/movement-history");
  });

  // STATUS
  it("Filter the Status", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    // instock
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "IN STOCK")
      .click();

    cy.wait("@getStockMovement");

    // purchases
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "PURCHASES")
      .click();

    cy.wait("@getStockMovement");

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  // DATE
  it("Filter the date", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="stock_movement_date"]').type("2026-06-16");
    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_date"]').clear();
  });

  // PRODUCTS
  it("Should filter the product when selecting a name", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getStockMovement");

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

  // QUANTITY
  it("Should filter by min quantity", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_qty_min"]').type("10");

    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_qty_min"]').clear();
  });

  it("Should filter by max quantity", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_qty_max"]').type("100");

    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_qty_max"]').clear();
  });

  // BEFORE
  it("Should filter by min before qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_before_qty_min"]').type("10");

    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_before_qty_min"]').clear();
  });

  it("Should filter by max before qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_before_qty_max"]').type("100");

    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_before_qty_max"]').clear();
  });

  // AFTER
  it("Should filter by min after qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_after_qty_min"]').type("10");

    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_after_qty_min"]').clear();
  });

  it("Should filter by max after qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_after_qty_max"]').type("100");

    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_after_qty_max"]').clear();
  });

  // LOCATIONS
  it("Should filter by location when type", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_location"]').type("Dolores, Quezon");

    cy.wait("@getStockMovement");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_location"]').clear();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getStockMovement");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });

  //SEARCH
  it("Search a product", () => {
    cy.viewport(390, 844); // iphone 13 viewport

    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="search-input"]').type("Banana{enter}");

    cy.wait("@getStockMovement");

    cy.contains("Banana", { timeout: 1000 }).should("exist");
  });
});
