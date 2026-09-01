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

    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "pending")
      .click();

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  // RETURN NUMBER
  it("Should filter the return number as the user types", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="return_product_number"]').type("RET");

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_number"]').clear();
  });

  // DATE
  it("Should filter by return date", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="return_product_date"]').type("2026-08-14");

    cy.wait("@getReturns");

    cy.get('[data-testid="return_product_date"]').clear();
  });

  // ORDER NUMBER
  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="return_product_order_number"]').type("ORD");

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_order_number"]').clear();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getReturns");

        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-customer"] .react-select__clear-indicator',
    ).click();
  });

  // PRODUCT
  it("Should filter by product", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    // pick a product known to have existing returns rather than an
    // arbitrary active product, which may have none
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains(".react-select__option", "Cassava chips")
      .click();

    cy.wait("@getReturns");

    cy.contains('[data-testid="table-row"]', "Cassava chips").should(
      "exist",
    );

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  // PRODUCT OWNER
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });

  // RESOLUTION TYPE
  it("Should filter the resolution type as the user types", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="return_product_resolution_type"]').type("refund");

    cy.wait("@getReturns");
    cy.wait(1000);

    cy.get('[data-testid="return_product_resolution_type"]').clear();
  });

  // AMOUNT
  it("Should filter by min amount", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");
    cy.get('[data-testid="return_product_amount_min"]').type("1");

    cy.wait("@getReturns");

    cy.get('[data-testid="return_product_amount_min"]').clear();
  });

  it("Should filter by max amount", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");
    cy.get('[data-testid="return_product_amount_max"]').type("100000");

    cy.wait("@getReturns");

    cy.get('[data-testid="return_product_amount_max"]').clear();
  });

  // REASON
  it("Should filter the reason as the user types", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="return_product_reason"]').type("Damage");

    cy.wait("@getReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_reason"]').clear();
  });

  // RESTOCKED
  it("Should filter the restocked column as the user types", () => {
    cy.intercept("POST", "**/returns-products/page/*").as("getReturns");

    cy.get('[data-testid="return_product_is_restocked"]').type("1");

    cy.wait("@getReturns");
    cy.wait(1000);

    cy.get('[data-testid="return_product_is_restocked"]').clear();
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
