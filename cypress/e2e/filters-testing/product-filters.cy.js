describe("Product Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/products");
  });

  // STATUS
  it("Filter the Inactive and Active Status", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

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
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_name"]').type("Cassava");

    cy.wait("@getProducts");
    cy.wait(1000);

    cy.get('[data-testid="products_name"]').clear();
  });

  // SKU
  it("Should filter the SKU when type", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_sku"]').type("SKU001");

    cy.wait("@getProducts");
    cy.wait(1000);

    cy.get('[data-testid="products_sku"]').clear();
  });

  // CATEGORY
  it("Should filter the category when type", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_category"]').type("chips");

    cy.wait("@getProducts");
    cy.wait(1000);

    cy.get('[data-testid="products_category"]').clear();
  });

  // PRICE
  it("Should filter by min price", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_price_min"]').type("10");

    cy.wait("@getProducts");
    cy.contains("10").should("exist");

    cy.get('[data-testid="products_price_min"]').clear();
  });

  it("Should filter by max price", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_price_max"]').type("20");

    cy.wait("@getProducts");
    cy.contains("20").should("exist");

    cy.get('[data-testid="products_price_max"]').clear();
  });

  it("Should filter by price range", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_price_min"]').type("20");
    cy.get('[data-testid="products_price_max"]').type("100");

    cy.wait("@getProducts");

    cy.get('[data-testid="products_price_min"]').clear();
    cy.get('[data-testid="products_price_max"]').clear();
  });

  // COST
  it("Should filter by min cost", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_cost_min"]').type("10");

    cy.wait("@getProducts");
    cy.contains("10").should("exist");

    cy.get('[data-testid="products_cost_min"]').clear();
  });

  it("Should filter by max cost", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_cost_max"]').type("20");

    cy.wait("@getProducts");
    cy.contains("20").should("exist");

    cy.get('[data-testid="products_cost_max"]').clear();
  });

  it("Should filter by cost range", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_cost_min"]').type("20");
    cy.get('[data-testid="products_cost_max"]').type("100");

    cy.wait("@getProducts");

    cy.get('[data-testid="products_cost_min"]').clear();
    cy.get('[data-testid="products_cost_max"]').clear();
  });

  // STOCKS
  it("Should filter by min stocks", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_stocks_min"]').type("10");

    cy.wait("@getProducts");
    cy.contains("10").should("exist");

    cy.get('[data-testid="products_stocks_min"]').clear();
  });

  it("Should filter by max stocks", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_stocks_max"]').type("20");

    cy.wait("@getProducts");
    cy.contains("20").should("exist");

    cy.get('[data-testid="products_stocks_max"]').clear();
  });

  it("Should filter by stocks range", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_stocks_min"]').type("20");
    cy.get('[data-testid="products_stocks_max"]').type("100");

    cy.wait("@getProducts");

    cy.get('[data-testid="products_stocks_min"]').clear();
    cy.get('[data-testid="products_stocks_max"]').clear();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get("#react-select-5-option-0").click();

    cy.get(".react-select__clear-indicator").click();
  });
});
