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
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "Active")
      .click();

    cy.wait("@getProducts");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // inactive
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "Inactive")
      .click();

    cy.wait("@getProducts");

    cy.get('[data-testid="filter-status-btn"] .react-select__clear-indicator').click();
  });

  // PRODUCTS
  it("Should filter the product when selecting a name", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getProducts");

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
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.get('[data-testid="products_sku"]').type("SKU001");

    cy.wait("@getProducts");
    cy.wait(1000);

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains('[data-testid="table-row"]', "SKU001").should("exist");

    cy.get('[data-testid="products_sku"]').clear();
  });

  // CATEGORY
  it("Should filter the category when selecting a category", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-category"]').click();
    cy.get('[data-testid="filter-category"] .react-select__option')
      .first()
      .then(($option) => {
        const categoryName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getProducts");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', categoryName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-category"] .react-select__clear-indicator',
    ).click();
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
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getProducts");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-owner"] .react-select__clear-indicator').click();
  });

  //SEARCH
  it("Search a product", () => {
    cy.viewport(390, 844); // iphone 13 viewport

    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="search-input"]').type("Cassava{enter}");

    cy.wait("@getProducts");

    cy.contains("Cassava", { timeout: 1000 }).should("exist");
  });

  // CLEAR ALL FILTERS
  it("Clears all filters and returns to the unfiltered list", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.wait("@getProducts");
    cy.get('[data-testid="table-row"]', { timeout: 20000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get("@getProducts.all").then((interceptions) => {
      const baselineCount = interceptions.length;

      cy.get('[data-testid="products_sku"]').type("SKU001");
      cy.wait("@getProducts");

      cy.get('[data-testid="products_price_min"]').type("1");
      cy.wait("@getProducts");

      cy.get('[data-testid="products_price_max"]').type("100000");
      cy.wait("@getProducts");

      cy.get('[data-testid="table-row"]').should(
        "have.length.greaterThan",
        0,
      );

      cy.get('[data-testid="products_sku"]').clear();
      cy.get('[data-testid="products_price_min"]').clear();
      cy.get('[data-testid="products_price_max"]').clear();

      cy.get("@getProducts.all").should(
        "have.length.greaterThan",
        baselineCount,
      );

      cy.get('[data-testid="table-row"]').should(
        "have.length.greaterThan",
        0,
      );
    });
  });
});
