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
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("li", "Active").click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getProducts");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // inactive
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]')
      .contains("li", "Inactive")
      .click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getProducts");

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();
  });

  // PRODUCTS
  it("Should filter the product when selecting a name", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-product-name"] li')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();
        cy.get('[data-testid="filter-product-name"]')
          .contains("button", "Filter")
          .click();

        cy.wait("@getProducts");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', productName).should(
          "exist",
        );
      });

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains("button", "Clear")
      .click();
  });

  // SKU
  it("Should filter the SKU when type", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-product-sku"]').click();
    cy.get('[data-testid="filter-product-sku-search"]').type("SKU001");
    cy.get('[data-testid="filter-product-sku"] li')
      .contains("SKU001")
      .click();
    cy.get('[data-testid="filter-product-sku"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getProducts");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains('[data-testid="table-row"]', "SKU001").should("exist");

    cy.get('[data-testid="filter-product-sku"]').click();
    cy.get('[data-testid="filter-product-sku"]')
      .contains("button", "Clear")
      .click();
  });

  // CATEGORY
  it("Should filter the category when selecting a category", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-category"]').click();
    cy.get('[data-testid="filter-category"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-category"] li')
      .first()
      .then(($option) => {
        const categoryName = $option.text();
        cy.wrap($option).click();
        cy.get('[data-testid="filter-category"]')
          .contains("button", "Filter")
          .click();

        cy.wait("@getProducts");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', categoryName).should(
          "exist",
        );
      });

    cy.get('[data-testid="filter-category"]').click();
    cy.get('[data-testid="filter-category"]')
      .contains("button", "Clear")
      .click();
  });

  // MULTIPLE CATEGORIES
  it("Should filter the products when selecting multiple categories", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    const categoryNames = [];

    cy.get('[data-testid="filter-category"]').click();
    cy.get('[data-testid="filter-category"] li').should(
      "have.length.greaterThan",
      1,
    );

    // pick the first two options - the checkbox dropdown keeps accumulating
    // selections in its draft (nothing is applied until "Filter" is
    // clicked), so both clicks land before the request fires
    cy.get('[data-testid="filter-category"] li')
      .eq(0)
      .then(($option) => {
        categoryNames.push($option.text());
        cy.wrap($option).click();
      });
    cy.get('[data-testid="filter-category"] li')
      .eq(1)
      .then(($option) => {
        categoryNames.push($option.text());
        cy.wrap($option).click();
      });

    cy.get('[data-testid="filter-category"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getProducts");

    cy.get('[data-testid="filter-category"]').should(
      "contain.text",
      "2 selected",
    );
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.get('[data-testid="table-row"]').each(($row) => {
      cy.wrap($row)
        .invoke("text")
        .then((text) => {
          expect(categoryNames.some((name) => text.includes(name))).to.be
            .true;
        });
    });

    cy.get('[data-testid="filter-category"]').click();
    cy.get('[data-testid="filter-category"]')
      .contains("button", "Clear")
      .click();
  });

  // PRICE
  it("Should filter by min price", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-price-trigger"]').click();
    cy.contains('[data-testid="filter-price"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-price"] [data-testid^="filter-price_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-price"]').contains("button", "Filter").click();

    cy.wait("@getProducts");
    cy.contains("10").should("exist");

    cy.get('[data-testid="filter-price-trigger"]').click();
    cy.get('[data-testid="filter-price"]').contains("button", "Clear").click();
  });

  it("Should filter by max price", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-price-trigger"]').click();
    cy.contains('[data-testid="filter-price"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-price"] [data-testid^="filter-price_"][data-testid$="_max"]',
    ).type("20");
    cy.get('[data-testid="filter-price"]').contains("button", "Filter").click();

    cy.wait("@getProducts");
    cy.contains("20").should("exist");

    cy.get('[data-testid="filter-price-trigger"]').click();
    cy.get('[data-testid="filter-price"]').contains("button", "Clear").click();
  });

  it("Should filter by price range", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-price-trigger"]').click();
    cy.contains('[data-testid="filter-price"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-price"] [data-testid^="filter-price_"][data-testid$="_min"]',
    ).type("20");
    cy.get(
      '[data-testid="filter-price"] [data-testid^="filter-price_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-price"]').contains("button", "Filter").click();

    cy.wait("@getProducts");

    cy.get('[data-testid="filter-price-trigger"]').click();
    cy.get('[data-testid="filter-price"]').contains("button", "Clear").click();
  });

  // COST
  it("Should filter by min cost", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-cost-trigger"]').click();
    cy.contains('[data-testid="filter-cost"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-cost"] [data-testid^="filter-cost_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-cost"]').contains("button", "Filter").click();

    cy.wait("@getProducts");
    cy.contains("10").should("exist");

    cy.get('[data-testid="filter-cost-trigger"]').click();
    cy.get('[data-testid="filter-cost"]').contains("button", "Clear").click();
  });

  it("Should filter by max cost", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-cost-trigger"]').click();
    cy.contains('[data-testid="filter-cost"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-cost"] [data-testid^="filter-cost_"][data-testid$="_max"]',
    ).type("20");
    cy.get('[data-testid="filter-cost"]').contains("button", "Filter").click();

    cy.wait("@getProducts");
    cy.contains("20").should("exist");

    cy.get('[data-testid="filter-cost-trigger"]').click();
    cy.get('[data-testid="filter-cost"]').contains("button", "Clear").click();
  });

  it("Should filter by cost range", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-cost-trigger"]').click();
    cy.contains('[data-testid="filter-cost"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-cost"] [data-testid^="filter-cost_"][data-testid$="_min"]',
    ).type("20");
    cy.get(
      '[data-testid="filter-cost"] [data-testid^="filter-cost_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-cost"]').contains("button", "Filter").click();

    cy.wait("@getProducts");

    cy.get('[data-testid="filter-cost-trigger"]').click();
    cy.get('[data-testid="filter-cost"]').contains("button", "Clear").click();
  });

  // STOCKS
  it("Should filter by min stocks", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-stocks-trigger"]').click();
    cy.contains('[data-testid="filter-stocks"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-stocks"] [data-testid^="filter-stocks_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-stocks"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getProducts");
    cy.contains("10").should("exist");

    cy.get('[data-testid="filter-stocks-trigger"]').click();
    cy.get('[data-testid="filter-stocks"]').contains("button", "Clear").click();
  });

  it("Should filter by max stocks", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-stocks-trigger"]').click();
    cy.contains('[data-testid="filter-stocks"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-stocks"] [data-testid^="filter-stocks_"][data-testid$="_max"]',
    ).type("20");
    cy.get('[data-testid="filter-stocks"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getProducts");
    cy.contains("20").should("exist");

    cy.get('[data-testid="filter-stocks-trigger"]').click();
    cy.get('[data-testid="filter-stocks"]').contains("button", "Clear").click();
  });

  it("Should filter by stocks range", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-stocks-trigger"]').click();
    cy.contains('[data-testid="filter-stocks"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-stocks"] [data-testid^="filter-stocks_"][data-testid$="_min"]',
    ).type("20");
    cy.get(
      '[data-testid="filter-stocks"] [data-testid^="filter-stocks_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-stocks"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getProducts");

    cy.get('[data-testid="filter-stocks-trigger"]').click();
    cy.get('[data-testid="filter-stocks"]').contains("button", "Clear").click();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-owner"] li').first().click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Filter").click();

    cy.wait("@getProducts");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Clear").click();
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

      cy.get('[data-testid="filter-product-sku"]').click();
      cy.get('[data-testid="filter-product-sku-search"]').type("SKU001");
      cy.get('[data-testid="filter-product-sku"] li')
        .contains("SKU001")
        .click();
      cy.get('[data-testid="filter-product-sku"]')
        .contains("button", "Filter")
        .click();
      cy.wait("@getProducts");

      cy.get('[data-testid="filter-price-trigger"]').click();
      cy.contains('[data-testid="filter-price"] button', "Add range").click();
      cy.get(
        '[data-testid="filter-price"] [data-testid^="filter-price_"][data-testid$="_min"]',
      ).type("1");
      cy.get(
        '[data-testid="filter-price"] [data-testid^="filter-price_"][data-testid$="_max"]',
      ).type("100000");
      cy.get('[data-testid="filter-price"]')
        .contains("button", "Filter")
        .click();
      cy.wait("@getProducts");

      cy.get('[data-testid="table-row"]').should(
        "have.length.greaterThan",
        0,
      );

      cy.get('[data-testid="filter-product-sku"]').click();
      cy.get('[data-testid="filter-product-sku"]')
        .contains("button", "Clear")
        .click();

      cy.get('[data-testid="filter-price-trigger"]').click();
      cy.get('[data-testid="filter-price"]')
        .contains("button", "Clear")
        .click();

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
