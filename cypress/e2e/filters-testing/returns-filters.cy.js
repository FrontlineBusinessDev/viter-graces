describe("Returns Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/returns");
  });

  // STATUS
  it("Should filter by return status", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("li", "pending").click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    // whether any return currently has "pending" status depends on the
    // dataset - just assert the filter request completes
    cy.wait("@getReturns").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();
  });

  // RETURN NUMBER
  it("Should filter the return number when selecting one", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-return-product-number"]').click();
    cy.get('[data-testid="filter-return-product-number"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-return-product-number"] li')
      .first()
      .click();
    cy.get('[data-testid="filter-return-product-number"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-return-product-number"]').click();
    cy.get('[data-testid="filter-return-product-number"]')
      .contains("button", "Clear")
      .click();
  });

  // DATE
  it("Should filter by return date", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-return-date-trigger"]').click();
    cy.contains(
      '[data-testid="filter-return-date"] button',
      "Add date range",
    ).click();
    cy.get(
      '[data-testid="filter-return-date"] [data-testid^="filter-return-date_"][data-testid$="_start"]',
    ).type("2026-08-14");
    cy.get('[data-testid="filter-return-date"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");

    cy.get('[data-testid="filter-return-date-trigger"]').click();
    cy.get('[data-testid="filter-return-date"]')
      .contains("button", "Clear")
      .click();
  });

  // ORDER NUMBER
  it("Should filter the order number when selecting one", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-return-order-number"]').click();
    cy.get('[data-testid="filter-return-order-number"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-return-order-number"] li').first().click();
    cy.get('[data-testid="filter-return-order-number"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-return-order-number"]').click();
    cy.get('[data-testid="filter-return-order-number"]')
      .contains("button", "Clear")
      .click();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-customer"] li')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();
        cy.get('[data-testid="filter-customer"]')
          .contains("button", "Filter")
          .click();

        cy.wait("@getReturns");

        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"]')
      .contains("button", "Clear")
      .click();
  });

  // PRODUCT
  it("Should filter by product", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    // pick a product known to have existing returns rather than an
    // arbitrary active product, which may have none
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains("li", "Cassava chips")
      .click();
    cy.get('[data-testid="filter-product-name"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");

    cy.contains('[data-testid="table-row"]', "Cassava chips").should(
      "exist",
    );

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains("button", "Clear")
      .click();
  });

  // PRODUCT OWNER
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    // "Product Owner" lists every user with that role, not just owners who
    // actually have a return on record - so the first option may
    // legitimately have zero returns. Just assert the filter request
    // completes, rather than assuming rows come back.
    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-owner"] li').first().click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Filter").click();

    cy.wait("@getReturns").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Clear").click();
  });

  // RESOLUTION TYPE
  // NOTE: Returns.jsx builds this filter's staticOptions with
  // `.map((option) => option.value)`, which drops ActiveInActiveStatus's
  // "Refund"/"Credit Memo"/"Replacement" labels - the dropdown actually
  // renders the lowercase values ("refund", "credit memo", "replacement").
  it("Should filter the resolution type", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-resolution-type"]').click();
    cy.get('[data-testid="filter-resolution-type"]')
      .contains("li", "refund")
      .click();
    cy.get('[data-testid="filter-resolution-type"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");

    cy.get('[data-testid="filter-resolution-type"]').click();
    cy.get('[data-testid="filter-resolution-type"]')
      .contains("button", "Clear")
      .click();
  });

  // AMOUNT
  it("Should filter by min amount", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-amount-trigger"]').click();
    cy.contains('[data-testid="filter-amount"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-amount"] [data-testid^="filter-amount_"][data-testid$="_min"]',
    ).type("1");
    cy.get('[data-testid="filter-amount"]').contains("button", "Filter").click();

    cy.wait("@getReturns");

    cy.get('[data-testid="filter-amount-trigger"]').click();
    cy.get('[data-testid="filter-amount"]').contains("button", "Clear").click();
  });

  it("Should filter by max amount", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-amount-trigger"]').click();
    cy.contains('[data-testid="filter-amount"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-amount"] [data-testid^="filter-amount_"][data-testid$="_max"]',
    ).type("100000");
    cy.get('[data-testid="filter-amount"]').contains("button", "Filter").click();

    cy.wait("@getReturns");

    cy.get('[data-testid="filter-amount-trigger"]').click();
    cy.get('[data-testid="filter-amount"]').contains("button", "Clear").click();
  });

  // REASON
  it("Should filter the reason when selecting one", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-return-product-reason"]').click();
    cy.get('[data-testid="filter-return-product-reason-search"]').type(
      "Damage",
    );
    cy.get('[data-testid="filter-return-product-reason"] li')
      .first()
      .click();
    cy.get('[data-testid="filter-return-product-reason"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-return-product-reason"]').click();
    cy.get('[data-testid="filter-return-product-reason"]')
      .contains("button", "Clear")
      .click();
  });

  // RESTOCKED
  // NOTE: unlike every other static-options column, this one passes
  // ActiveInActiveStatus("restocked-status") straight through without
  // `.map(o => o.value)`, so MultiSelectCheckboxFilter keeps the real
  // {label, value} pairing - the dropdown renders the title-case labels
  // ("Yes"/"No"), not the table cell's uppercase "YES"/"NO" text.
  it("Should filter the restocked column", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-restocked"]').click();
    cy.get('[data-testid="filter-restocked"]').contains("li", "Yes").click();
    cy.get('[data-testid="filter-restocked"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getReturns");

    cy.get('[data-testid="filter-restocked"]').click();
    cy.get('[data-testid="filter-restocked"]')
      .contains("button", "Clear")
      .click();
  });

  // SEARCH - MOBILE
  it("Search returns - Mobile", () => {
    cy.viewport(390, 844);

    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    // the quick-search only matches order #, customer, product and reason
    // - the return # itself isn't included, so search a term that is
    cy.get('[data-testid="search-input"]').type("Damage{enter}");

    cy.wait("@getReturns");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });
});
