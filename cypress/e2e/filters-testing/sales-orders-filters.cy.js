describe("Sales Orders Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/sales-orders");

    // the order date column defaults to today's date (InfiniteTable.jsx's
    // "sales-order" defaultValue), hiding every order that wasn't placed
    // today - clear it via the date filter's own popover so filter tests
    // see the full list
    cy.get('[data-testid="filter-order-date-trigger"]').click();
    cy.get('[data-testid="filter-order-date"]')
      .contains("button", "Clear")
      .click();
  });

  // STATUS
  it("Should filter by payment status", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("li", "paid").click();
    cy.get('[data-testid="filter-status"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-status"]').click();
    cy.get('[data-testid="filter-status"]').contains("button", "Clear").click();
  });

  // ORDER NUMBER
  it("Should filter the order number when selecting one", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-order-number"]').click();
    cy.get('[data-testid="filter-order-number"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-order-number"] li')
      .first()
      .then(($option) => {
        const orderNumber = $option.text();
        cy.wrap($option).click();
        cy.get('[data-testid="filter-order-number"]')
          .contains("button", "Filter")
          .click();

        cy.wait("@getSalesOrders");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', orderNumber).should(
          "exist",
        );
      });

    cy.get('[data-testid="filter-order-number"]').click();
    cy.get('[data-testid="filter-order-number"]')
      .contains("button", "Clear")
      .click();
  });

  // DATE
  it("Should filter by order date", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-order-date-trigger"]').click();
    cy.contains(
      '[data-testid="filter-order-date"] button',
      "Add date range",
    ).click();
    cy.get(
      '[data-testid="filter-order-date"] [data-testid^="filter-order-date_"][data-testid$="_start"]',
    ).type("2026-08-14");
    cy.get('[data-testid="filter-order-date"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-order-date-trigger"]').click();
    cy.get('[data-testid="filter-order-date"]')
      .contains("button", "Clear")
      .click();
  });

  // DUE DATE
  it("Should filter by due date", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-due-date-trigger"]').click();
    cy.contains(
      '[data-testid="filter-due-date"] button',
      "Add date range",
    ).click();
    cy.get(
      '[data-testid="filter-due-date"] [data-testid^="filter-due-date_"][data-testid$="_start"]',
    ).type("2026-08-14");
    cy.get('[data-testid="filter-due-date"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-due-date-trigger"]').click();
    cy.get('[data-testid="filter-due-date"]')
      .contains("button", "Clear")
      .click();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

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

        cy.wait("@getSalesOrders");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"]')
      .contains("button", "Clear")
      .click();
  });

  // TOTAL
  it("Should filter by min total", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-total-trigger"]').click();
    cy.contains('[data-testid="filter-total"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-total"] [data-testid^="filter-total_"][data-testid$="_min"]',
    ).type("1");
    cy.get('[data-testid="filter-total"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-total-trigger"]').click();
    cy.get('[data-testid="filter-total"]').contains("button", "Clear").click();
  });

  it("Should filter by max total", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-total-trigger"]').click();
    cy.contains('[data-testid="filter-total"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-total"] [data-testid^="filter-total_"][data-testid$="_max"]',
    ).type("100000");
    cy.get('[data-testid="filter-total"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-total-trigger"]').click();
    cy.get('[data-testid="filter-total"]').contains("button", "Clear").click();
  });

  // PAID
  it("Should filter by min paid amount", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-paid-trigger"]').click();
    cy.contains('[data-testid="filter-paid"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-paid"] [data-testid^="filter-paid_"][data-testid$="_min"]',
    ).type("1");
    cy.get('[data-testid="filter-paid"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-paid-trigger"]').click();
    cy.get('[data-testid="filter-paid"]').contains("button", "Clear").click();
  });

  it("Should filter by max paid amount", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-paid-trigger"]').click();
    cy.contains('[data-testid="filter-paid"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-paid"] [data-testid^="filter-paid_"][data-testid$="_max"]',
    ).type("100000");
    cy.get('[data-testid="filter-paid"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-paid-trigger"]').click();
    cy.get('[data-testid="filter-paid"]').contains("button", "Clear").click();
  });

  // BALANCE
  it("Should filter by min balance", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-balance-trigger"]').click();
    cy.contains('[data-testid="filter-balance"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-balance"] [data-testid^="filter-balance_"][data-testid$="_min"]',
    ).type("1");
    cy.get('[data-testid="filter-balance"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-balance-trigger"]').click();
    cy.get('[data-testid="filter-balance"]')
      .contains("button", "Clear")
      .click();
  });

  it("Should filter by max balance", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-balance-trigger"]').click();
    cy.contains('[data-testid="filter-balance"] button', "Add range").click();
    cy.get(
      '[data-testid="filter-balance"] [data-testid^="filter-balance_"][data-testid$="_max"]',
    ).type("100000");
    cy.get('[data-testid="filter-balance"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-balance-trigger"]').click();
    cy.get('[data-testid="filter-balance"]')
      .contains("button", "Clear")
      .click();
  });

  // PAYMENT METHOD
  it("Should filter by payment method", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-method"]').click();
    cy.get('[data-testid="filter-method"]').contains("li", "cash").click();
    cy.get('[data-testid="filter-method"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-method"]').click();
    cy.get('[data-testid="filter-method"]').contains("button", "Clear").click();
  });

  // PAYMENT TERMS
  // NOTE: PaymentTermsList()'s "installment" entry has value "Installment"
  // (capital I) while its label is lowercase - since this column maps
  // options to `.value` only (staticOptions={PaymentTermsList().map(o =>
  // o.value)}), the dropdown renders "Installment", not "installment".
  it("Should filter by payment terms", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-payment-terms"]').click();
    cy.get('[data-testid="filter-payment-terms"]')
      .contains("li", "Installment")
      .click();
    cy.get('[data-testid="filter-payment-terms"]')
      .contains("button", "Filter")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-payment-terms"]').click();
    cy.get('[data-testid="filter-payment-terms"]')
      .contains("button", "Clear")
      .click();
  });

  // PRODUCT OWNER / CREATED BY
  it("Should filter by created by", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    // "Created By" lists every non-developer user account, not just users
    // who actually created a sales order - so the first option in the list
    // may legitimately have zero orders. Just assert the filter request
    // completes, rather than assuming rows come back.
    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] li').should(
      "have.length.greaterThan",
      0,
    );
    cy.get('[data-testid="filter-owner"] li').first().click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Filter").click();

    cy.wait("@getSalesOrders").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"]').contains("button", "Clear").click();
  });

  // NOTES
  it("Should filter the notes as the user types", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="sales_order_notes"]').type("test");

    cy.wait("@getSalesOrders");
    cy.wait(1000);

    cy.get('[data-testid="sales_order_notes"]').clear();
  });

  // SEARCH - MOBILE
  it("Search sales order - Mobile", () => {
    cy.viewport(390, 844);

    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="search-input"]').type("ORD{enter}");

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });
});
