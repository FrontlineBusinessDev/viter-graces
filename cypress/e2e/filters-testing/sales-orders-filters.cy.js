describe("Sales Orders Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/sales-orders");

    // the order date column defaults to today's date, hiding every order
    // that wasn't placed today - clear it so filter tests see the full list
    cy.get('thead [data-testid="sales_order_date"]').clear();
  });

  // STATUS
  it("Should filter by payment status", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-status-btn"]').eq(0).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .contains(".react-select__option", "paid")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .find(".react-select__clear-indicator")
      .click();
  });

  // ORDER NUMBER
  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="sales_order_number"]').type("ORD");

    cy.wait("@getSalesOrders");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_number"]').clear();
  });

  // DATE
  it("Should filter by order date", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('thead [data-testid="sales_order_date"]').type("2026-08-14");

    cy.wait("@getSalesOrders");

    cy.get('thead [data-testid="sales_order_date"]').clear();
  });

  // DUE DATE
  it("Should filter by due date", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="sales_order_due_date"]').type("2026-08-14");

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_due_date"]').clear();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getSalesOrders");

        cy.get('[data-testid="table-row"]').should(
          "have.length.greaterThan",
          0,
        );
        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-customer"] .react-select__clear-indicator',
    ).click();
  });

  // TOTAL
  it("Should filter by min total", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");
    cy.get('[data-testid="sales_order_total_receivable_amount_min"]').type(
      "1",
    );

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_total_receivable_amount_min"]').clear();
  });

  it("Should filter by max total", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");
    cy.get('[data-testid="sales_order_total_receivable_amount_max"]').type(
      "100000",
    );

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_total_receivable_amount_max"]').clear();
  });

  // PAID
  it("Should filter by min paid amount", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");
    cy.get('[data-testid="sales_order_paid_amount_min"]').type("1");

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_paid_amount_min"]').clear();
  });

  it("Should filter by max paid amount", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");
    cy.get('[data-testid="sales_order_paid_amount_max"]').type("100000");

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_paid_amount_max"]').clear();
  });

  // BALANCE
  it("Should filter by min balance", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");
    cy.get('[data-testid="sales_order_total_balance_amount_min"]').type("1");

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_total_balance_amount_min"]').clear();
  });

  it("Should filter by max balance", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");
    cy.get('[data-testid="sales_order_total_balance_amount_max"]').type(
      "100000",
    );

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="sales_order_total_balance_amount_max"]').clear();
  });

  // PAYMENT METHOD
  it("Should filter by payment method", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-status-btn"]').eq(1).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .contains(".react-select__option", "cash")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .find(".react-select__clear-indicator")
      .click();
  });

  // PAYMENT TERMS
  it("Should filter by payment terms", () => {
    cy.intercept("POST", "**/sales-order/page/*").as("getSalesOrders");

    cy.get('[data-testid="filter-status-btn"]').eq(2).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(2)
      .contains(".react-select__option", "installment")
      .click();

    cy.wait("@getSalesOrders");

    cy.get('[data-testid="filter-status-btn"]')
      .eq(2)
      .find(".react-select__clear-indicator")
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
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getSalesOrders").its("response.statusCode").should("eq", 200);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
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
