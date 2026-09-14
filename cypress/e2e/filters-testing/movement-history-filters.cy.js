describe("Movement History Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/movement-history");
  });

  // STATUS
  // NOTE: MovementHistory.jsx builds this filter's staticOptions with
  // `.map((option) => option.value)`, which drops ActiveInActiveStatus's
  // uppercase {label} and leaves MultiSelectCheckboxFilter to fall back to
  // the raw (lowercase) value as its own display label - so the dropdown
  // actually renders "in stock" / "stock out - sales", not the ALL CAPS
  // labels the table cells show.
  it("Filter the Status", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    // instock
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("li", "in stock").click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    // stock out - sales
    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]')
      .contains("li", "stock out - sales")
      .click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();
  });

  // DATE
  it("Filter the date", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-movement-date-trigger"]').click();
    cy.contains(
      '[data-testid="filter-movement-date"] button',
      "Add date range",
    ).click();
    cy.get(
      '[data-testid="filter-movement-date"] [data-testid^="filter-movement-date_"][data-testid$="_start"]',
    ).type("2026-06-16");
    cy.get('[data-testid="filter-movement-date"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-movement-date-trigger"]').click();
    cy.get('[data-testid="filter-movement-date"]')
      .contains("button", "Clear")
      .click();
  });

  // PRODUCTS
  it("Should filter the product when selecting a name", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

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

        cy.wait("@getStockMovement");

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

  // QUANTITY
  it("Should filter by min quantity", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-qty-trigger"]').click();
    cy.contains('[data-testid="filter-qty"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-qty"] [data-testid^="filter-qty_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-qty"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-qty-trigger"]').click();
    cy.get('[data-testid="filter-qty"]').contains("button", "Clear").click();
  });

  it("Should filter by max quantity", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-qty-trigger"]').click();
    cy.contains('[data-testid="filter-qty"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-qty"] [data-testid^="filter-qty_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-qty"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-qty-trigger"]').click();
    cy.get('[data-testid="filter-qty"]').contains("button", "Clear").click();
  });

  // BEFORE
  it("Should filter by min before qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-before-trigger"]').click();
    cy.contains('[data-testid="filter-before"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-before"] [data-testid^="filter-before_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-before"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-before-trigger"]').click();
    cy.get('[data-testid="filter-before"]').contains("button", "Clear").click();
  });

  it("Should filter by max before qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-before-trigger"]').click();
    cy.contains('[data-testid="filter-before"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-before"] [data-testid^="filter-before_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-before"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-before-trigger"]').click();
    cy.get('[data-testid="filter-before"]').contains("button", "Clear").click();
  });

  // AFTER
  it("Should filter by min after qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-after-trigger"]').click();
    cy.contains('[data-testid="filter-after"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-after"] [data-testid^="filter-after_"][data-testid$="_min"]',
    ).type("10");
    cy.get('[data-testid="filter-after"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-after-trigger"]').click();
    cy.get('[data-testid="filter-after"]').contains("button", "Clear").click();
  });

  it("Should filter by max after qty", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-after-trigger"]').click();
    cy.contains('[data-testid="filter-after"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-after"] [data-testid^="filter-after_"][data-testid$="_max"]',
    ).type("100");
    cy.get('[data-testid="filter-after"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");

    cy.get('[data-testid="filter-after-trigger"]').click();
    cy.get('[data-testid="filter-after"]').contains("button", "Clear").click();
  });

  // LOCATIONS
  it("Should filter by location when type", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-product-location"]').click();
    cy.get('[data-testid="filter-product-location-search"]').type(
      "Dolores, Quezon",
    );
    cy.get('[data-testid="filter-product-location"] li').first().click();
    cy.get('[data-testid="filter-product-location"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getStockMovement");
    cy.wait(1000);

    cy.get('[data-testid="filter-product-location"]').click();
    cy.get('[data-testid="filter-product-location"]')
      .contains("button", "Clear")
      .click();
  });

  // PRODUCT OWNER
  it("Filter the Product Owner", () => {
    cy.intercept("POST", "**/stock-movement/page/*").as("getStockMovement");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-owner"] li').first().click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Filter").click();

    cy.wait("@getStockMovement");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Clear").click();
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
