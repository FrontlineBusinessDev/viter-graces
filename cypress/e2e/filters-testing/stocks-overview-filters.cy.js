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
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("li", "in stock").click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getStockOverview");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // low stock
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]')
      .contains("li", "low stock")
      .click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getStockOverview");

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();
  });

  // PRODUCTS
  it("Should filter the product when selecting a name", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

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

        cy.wait("@getStockOverview");

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
  // NOTE: the SKU column and the Unit column both render with
  // data-testid="filter-product-sku" (a pre-existing duplicate id in
  // StockOverview.jsx) - use .eq(0) to target the SKU one, matching column
  // order.
  it("Should filter the SKU when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-product-sku"]').eq(0).click();
    cy.get('[data-testid="filter-product-sku"]')
      .eq(0)
      .find('[data-testid="filter-product-sku-search"]')
      .type("002");
    cy.get('[data-testid="filter-product-sku"]').eq(0).find("li").first().click();
    cy.get('[data-testid="filter-product-sku"]')
      .eq(0)
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="filter-product-sku"]').eq(0).click();
    cy.get('[data-testid="filter-product-sku"]')
      .eq(0)
      .contains("button", "Clear")
      .click();
  });

  // LOCATIONS
  it("Should filter by location when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-product-location"]').click();
    cy.get('[data-testid="filter-product-location-search"]').type(
      "Dolores, Quezon",
    );
    cy.get('[data-testid="filter-product-location"] li').first().click();
    cy.get('[data-testid="filter-product-location"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="filter-product-location"]').click();
    cy.get('[data-testid="filter-product-location"]')
      .contains("button", "Clear")
      .click();
  });

  // CURRENT STOCK
  it("Should filter by min current stock", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-current-stock-trigger"]').click();
    cy.contains(
      '[data-testid="filter-current-stock"] button',
      "Add range",
    ).click();
    cy.get(
      '[data-testid="filter-current-stock"] [data-testid^="filter-current-stock_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-current-stock"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");
    cy.contains("10").should("exist");

    cy.get('[data-testid="filter-current-stock-trigger"]').click();
    cy.get('[data-testid="filter-current-stock"]')
      .contains("button", "Clear")
      .click();
  });

  it("Should filter by max current stock", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-current-stock-trigger"]').click();
    cy.contains(
      '[data-testid="filter-current-stock"] button',
      "Add range",
    ).click();
    cy.get(
      '[data-testid="filter-current-stock"] [data-testid^="filter-current-stock_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-current-stock"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");

    cy.get('[data-testid="filter-current-stock-trigger"]').click();
    cy.get('[data-testid="filter-current-stock"]')
      .contains("button", "Clear")
      .click();
  });

  // THRESHOLD
  it("Should filter by min threshold", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-threshold-trigger"]').click();
    cy.contains('[data-testid="filter-threshold"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-threshold"] [data-testid^="filter-threshold_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-threshold"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");
    cy.contains("10").should("exist");

    cy.get('[data-testid="filter-threshold-trigger"]').click();
    cy.get('[data-testid="filter-threshold"]')
      .contains("button", "Clear")
      .click();
  });

  it("Should filter by max threshold", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-threshold-trigger"]').click();
    cy.contains('[data-testid="filter-threshold"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-threshold"] [data-testid^="filter-threshold_"][data-testid$="_max"]',
    ).type("10");
    cy.get('[data-testid="filter-threshold"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");
    cy.contains("10").should("exist");

    cy.get('[data-testid="filter-threshold-trigger"]').click();
    cy.get('[data-testid="filter-threshold"]')
      .contains("button", "Clear")
      .click();
  });

  it("Should filter by threshold range", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-threshold-trigger"]').click();
    cy.contains('[data-testid="filter-threshold"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-threshold"] [data-testid^="filter-threshold_"][data-testid$="_min"]',
    ).type("20");
    cy.get(
      '[data-testid="filter-threshold"] [data-testid^="filter-threshold_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-threshold"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");

    cy.get('[data-testid="filter-threshold-trigger"]').click();
    cy.get('[data-testid="filter-threshold"]')
      .contains("button", "Clear")
      .click();
  });

  // UNIT
  // NOTE: see the SKU test above - .eq(1) is the Unit column's instance of
  // the duplicated "filter-product-sku" wrapper testid. The "-search" input
  // and the "li" options only exist in the DOM while THAT dropdown is open,
  // so - unlike the wrapper - there's only ever one match for them at a
  // time; query them scoped inside the .eq(1) wrapper instead of re-querying
  // the page-wide (and now ambiguous) "-search" testid with its own .eq(1).
  it("Should filter the unit when type", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-product-sku"]').eq(1).click();
    cy.get('[data-testid="filter-product-sku"]')
      .eq(1)
      .find('[data-testid="filter-product-sku-search"]')
      .type("pcs");
    cy.get('[data-testid="filter-product-sku"]').eq(1).find("li").first().click();
    cy.get('[data-testid="filter-product-sku"]')
      .eq(1)
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockOverview");
    cy.wait(1000);

    cy.get('[data-testid="filter-product-sku"]').eq(1).click();
    cy.get('[data-testid="filter-product-sku"]')
      .eq(1)
      .contains("button", "Clear")
      .click();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/stock-overview/page/*").as("getStockOverview");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-owner"] li').first().click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Filter").click();

    cy.wait("@getStockOverview");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Clear").click();
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
