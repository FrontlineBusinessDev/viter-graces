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
    cy.get("#react-select-3-option-0").click();

    // purchases
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get("#react-select-3-option-1").click();

    cy.get(".react-select__clear-indicator").click();
  });

  // DATE
  it("Filter the date", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="stock_movement_date"]').type("2026-06-16");
    cy.wait("@getStockMovement");

    cy.get('[data-testid="stock_movement_date"]').clear();
  });

  // PRODUCTS
  it("Should filter the product when type", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_product_name"]').type("Banana");

    cy.wait("@getStockMovement");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_product_name"]').clear();
  });

  // QUANTITY
  it("Should filter the quantity when type", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_qty"]').type("30");

    cy.wait("@getStockMovement");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_qty"]').clear();
  });

  // BEFORE
  it("Should filter the before when type", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_before_qty"]').type("30");

    cy.wait("@getStockMovement");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_before_qty"]').clear();
  });

  // AFTER
  it("Should filter the after when type", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");
    cy.get('[data-testid="stock_movement_after_qty"]').type("10");

    cy.wait("@getStockMovement");
    cy.wait(1000);

    cy.get('[data-testid="stock_movement_after_qty"]').clear();
  });

  // LOCATIONS
  it("Should filter the after when type", () => {
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
    cy.get("#react-select-5-option-0").click();

    cy.get(".react-select__clear-indicator").click();
  });
});
