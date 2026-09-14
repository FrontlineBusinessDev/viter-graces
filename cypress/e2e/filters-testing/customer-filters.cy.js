describe("Customer Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/customers");
  });

  // STATUS
  it("Should filter by active and inactive status", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    // active
    cy.get('[data-testid="filter-status"] button').first().click();
    cy.contains('[data-testid="filter-status"] li', "Active").click();
    cy.contains('[data-testid="filter-status"] button', "Filter").click();

    cy.wait("@getCustomer");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // switch to inactive - reopening the dropdown restores the draft to
    // what's applied ("Active"), so uncheck it before checking "Inactive"
    cy.get('[data-testid="filter-status"] button').first().click();
    cy.contains('[data-testid="filter-status"] li', "Active").click();
    cy.contains('[data-testid="filter-status"] li', "Inactive").click();
    cy.contains('[data-testid="filter-status"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-status"] button').first().click();
    cy.contains('[data-testid="filter-status"] button', "Clear").click();
  });

  // NAME
  it("Should filter by customer name", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-customer-name"] button').first().click();
    cy.get('[data-testid="filter-customer-name-search"]').type("Walk in");
    cy.contains('[data-testid="filter-customer-name"] li', "Walk in").click();
    cy.contains('[data-testid="filter-customer-name"] button', "Filter").click();

    cy.wait("@getCustomer");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains('[data-testid="table-row"]', "Walk in").should("exist");

    cy.get('[data-testid="filter-customer-name"] button').first().click();
    cy.contains('[data-testid="filter-customer-name"] button', "Clear").click();
  });

  // EMAIL
  it("Should filter by customer email", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-customer-email"] button').first().click();

    cy.get('[data-testid="filter-customer-email"] li')
      .first()
      .then(($option) => {
        const email = $option.text().trim();
        cy.wrap($option).click();
        cy.contains(
          '[data-testid="filter-customer-email"] button',
          "Filter",
        ).click();

        cy.wait("@getCustomer");
        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', email).should("exist");
      });

    cy.get('[data-testid="filter-customer-email"] button').first().click();
    cy.contains('[data-testid="filter-customer-email"] button', "Clear").click();
  });

  // PHONE
  it("Should filter by customer contact number", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-customer-contact"] button').first().click();

    cy.get('[data-testid="filter-customer-contact"] li')
      .first()
      .click();
    cy.contains(
      '[data-testid="filter-customer-contact"] button',
      "Filter",
    ).click();

    cy.wait("@getCustomer");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-customer-contact"] button').first().click();
    cy.contains(
      '[data-testid="filter-customer-contact"] button',
      "Clear",
    ).click();
  });

  // NUMBER OF ORDERS
  it("Should filter by min number of orders", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-num-orders-trigger"]').click();
    cy.contains('[data-testid="filter-num-orders"] button', "Add range").click();
    cy.get('[data-testid="filter-num-orders"] input[data-testid$="_min"]').type(
      "1",
    );
    cy.contains('[data-testid="filter-num-orders"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-num-orders-trigger"]').click();
    cy.contains('[data-testid="filter-num-orders"] button', "Clear").click();
  });

  it("Should filter by max number of orders", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-num-orders-trigger"]').click();
    cy.contains('[data-testid="filter-num-orders"] button', "Add range").click();
    cy.get('[data-testid="filter-num-orders"] input[data-testid$="_max"]').type(
      "100",
    );
    cy.contains('[data-testid="filter-num-orders"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-num-orders-trigger"]').click();
    cy.contains('[data-testid="filter-num-orders"] button', "Clear").click();
  });

  it("Should filter by number of orders range", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-num-orders-trigger"]').click();
    cy.contains('[data-testid="filter-num-orders"] button', "Add range").click();
    cy.get('[data-testid="filter-num-orders"] input[data-testid$="_min"]').type(
      "0",
    );
    cy.get('[data-testid="filter-num-orders"] input[data-testid$="_max"]').type(
      "100",
    );
    cy.contains('[data-testid="filter-num-orders"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-num-orders-trigger"]').click();
    cy.contains('[data-testid="filter-num-orders"] button', "Clear").click();
  });

  // TOTAL AMOUNT SPENT
  it("Should filter by min total amount spent", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-total-spent-trigger"]').click();
    cy.contains('[data-testid="filter-total-spent"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-total-spent"] input[data-testid$="_min"]',
    ).type("10");
    cy.contains('[data-testid="filter-total-spent"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-total-spent-trigger"]').click();
    cy.contains('[data-testid="filter-total-spent"] button', "Clear").click();
  });

  it("Should filter by max total amount spent", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-total-spent-trigger"]').click();
    cy.contains('[data-testid="filter-total-spent"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-total-spent"] input[data-testid$="_max"]',
    ).type("100000");
    cy.contains('[data-testid="filter-total-spent"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-total-spent-trigger"]').click();
    cy.contains('[data-testid="filter-total-spent"] button', "Clear").click();
  });

  // OUTSTANDING BALANCE
  it("Should filter by min outstanding balance", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-outstanding-balance-trigger"]').click();
    cy.contains(
      '[data-testid="filter-outstanding-balance"] button',
      "Add range",
    ).click();
    cy.get(
      '[data-testid="filter-outstanding-balance"] input[data-testid$="_min"]',
    ).type("10");
    cy.contains(
      '[data-testid="filter-outstanding-balance"] button',
      "Filter",
    ).click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-outstanding-balance-trigger"]').click();
    cy.contains(
      '[data-testid="filter-outstanding-balance"] button',
      "Clear",
    ).click();
  });

  it("Should filter by max outstanding balance", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-outstanding-balance-trigger"]').click();
    cy.contains(
      '[data-testid="filter-outstanding-balance"] button',
      "Add range",
    ).click();
    cy.get(
      '[data-testid="filter-outstanding-balance"] input[data-testid$="_max"]',
    ).type("100000");
    cy.contains(
      '[data-testid="filter-outstanding-balance"] button',
      "Filter",
    ).click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-outstanding-balance-trigger"]').click();
    cy.contains(
      '[data-testid="filter-outstanding-balance"] button',
      "Clear",
    ).click();
  });

  // OPEN CREDIT MEMO
  it("Should filter by min open credit memo", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-credit-memo-trigger"]').click();
    cy.contains('[data-testid="filter-credit-memo"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-credit-memo"] input[data-testid$="_min"]',
    ).type("10");
    cy.contains('[data-testid="filter-credit-memo"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-credit-memo-trigger"]').click();
    cy.contains('[data-testid="filter-credit-memo"] button', "Clear").click();
  });

  it("Should filter by max open credit memo", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="filter-credit-memo-trigger"]').click();
    cy.contains('[data-testid="filter-credit-memo"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-credit-memo"] input[data-testid$="_max"]',
    ).type("100000");
    cy.contains('[data-testid="filter-credit-memo"] button', "Filter").click();

    cy.wait("@getCustomer");

    cy.get('[data-testid="filter-credit-memo-trigger"]').click();
    cy.contains('[data-testid="filter-credit-memo"] button', "Clear").click();
  });

  // SEARCH - MOBILE
  it("Search customer - Mobile", () => {
    cy.viewport(390, 844);

    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="search-input"]').type("Walk in{enter}");

    cy.wait("@getCustomer");

    cy.contains("Walk in", { timeout: 1000 }).should("exist");
  });

  // CLEAR ALL FILTERS
  it("Clears all filters and returns to the unfiltered list", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.wait("@getCustomer");
    cy.get('[data-testid="table-row"]', { timeout: 20000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get("@getCustomer.all").then((interceptions) => {
      const baselineCount = interceptions.length;

      cy.get('[data-testid="filter-customer-name"] button').first().click();
      cy.get('[data-testid="filter-customer-name-search"]').type("Walk in");
      cy.contains(
        '[data-testid="filter-customer-name"] li',
        "Walk in",
      ).click();
      cy.contains(
        '[data-testid="filter-customer-name"] button',
        "Filter",
      ).click();
      cy.wait("@getCustomer");

      cy.get('[data-testid="filter-customer-email"] button').first().click();
      cy.get('[data-testid="filter-customer-email"] li').first().click();
      cy.contains(
        '[data-testid="filter-customer-email"] button',
        "Filter",
      ).click();
      cy.wait("@getCustomer");

      cy.get('[data-testid="filter-customer-name"] button').first().click();
      cy.contains(
        '[data-testid="filter-customer-name"] button',
        "Clear",
      ).click();
      cy.wait("@getCustomer");

      cy.get('[data-testid="filter-customer-email"] button').first().click();
      cy.contains(
        '[data-testid="filter-customer-email"] button',
        "Clear",
      ).click();
      cy.wait("@getCustomer");

      cy.get("@getCustomer.all").should(
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
