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
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "Active")
      .click();

    cy.wait("@getCustomer");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // the select is narrow, so once a value is chosen its clickable area
    // overlaps the clear (x) indicator - clear it first so the control is
    // back to its empty/placeholder state before reopening for "Inactive"
    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();

    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "Inactive")
      .click();

    cy.wait("@getCustomer");

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  // NAME
  it("Should filter the name as the user types", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="customer_name"]').type("Walk in");

    cy.wait("@getCustomer");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains('[data-testid="table-row"]', "Walk in").should("exist");

    cy.get('[data-testid="customer_name"]').clear();
  });

  // EMAIL
  it("Should filter the email as the user types", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="customer_email"]').type("gmail.com");

    cy.wait("@getCustomer");
    cy.wait(1000);

    cy.get('[data-testid="customer_email"]').clear();
  });

  // PHONE
  it("Should filter the contact number as the user types", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="customer_phone"]').type("09");

    cy.wait("@getCustomer");
    cy.wait(1000);

    cy.get('[data-testid="customer_phone"]').clear();
  });

  // NUMBER OF ORDERS
  it("Should filter by min number of orders", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="number_of_orders_min"]').type("1");

    cy.wait("@getCustomer");

    cy.get('[data-testid="number_of_orders_min"]').clear();
  });

  it("Should filter by max number of orders", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="number_of_orders_max"]').type("100");

    cy.wait("@getCustomer");

    cy.get('[data-testid="number_of_orders_max"]').clear();
  });

  it("Should filter by number of orders range", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="number_of_orders_min"]').type("0");
    cy.get('[data-testid="number_of_orders_max"]').type("100");

    cy.wait("@getCustomer");

    cy.get('[data-testid="number_of_orders_min"]').clear();
    cy.get('[data-testid="number_of_orders_max"]').clear();
  });

  // TOTAL AMOUNT SPENT
  it("Should filter by min total amount spent", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="total_amount_spent_min"]').type("10");

    cy.wait("@getCustomer");

    cy.get('[data-testid="total_amount_spent_min"]').clear();
  });

  it("Should filter by max total amount spent", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="total_amount_spent_max"]').type("100000");

    cy.wait("@getCustomer");

    cy.get('[data-testid="total_amount_spent_max"]').clear();
  });

  // OUTSTANDING BALANCE
  it("Should filter by min outstanding balance", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="outstanding_balance_min"]').type("10");

    cy.wait("@getCustomer");

    cy.get('[data-testid="outstanding_balance_min"]').clear();
  });

  it("Should filter by max outstanding balance", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="outstanding_balance_max"]').type("100000");

    cy.wait("@getCustomer");

    cy.get('[data-testid="outstanding_balance_max"]').clear();
  });

  // OPEN CREDIT MEMO
  it("Should filter by min open credit memo", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="open_credit_memo_min"]').type("10");

    cy.wait("@getCustomer");

    cy.get('[data-testid="open_credit_memo_min"]').clear();
  });

  it("Should filter by max open credit memo", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.get('[data-testid="open_credit_memo_max"]').type("100000");

    cy.wait("@getCustomer");

    cy.get('[data-testid="open_credit_memo_max"]').clear();
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

      cy.get('[data-testid="customer_name"]').type("a");
      cy.wait("@getCustomer");

      cy.get('[data-testid="customer_email"]').type("com");
      cy.wait("@getCustomer");

      cy.get('[data-testid="table-row"]').should(
        "have.length.greaterThan",
        0,
      );

      cy.get('[data-testid="customer_name"]').clear();
      cy.get('[data-testid="customer_email"]').clear();

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
