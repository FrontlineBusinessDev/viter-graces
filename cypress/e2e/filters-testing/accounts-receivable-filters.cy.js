describe("Accounts Receivable Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/accounts-receivable");
  });

  // ORDER NUMBER
  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );

    cy.get('[data-testid="sales_order_number"]').type("ORD");

    cy.wait("@getAccountsReceivable");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_number"]').clear();
  });

  // DUE DATE
  it("Should filter by due date", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );

    cy.get('[data-testid="sales_order_due_date"]').type("2026-08-14");

    cy.wait("@getAccountsReceivable");

    cy.get('[data-testid="sales_order_due_date"]').clear();
  });

  // DATE
  it("Should filter by order date", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );

    cy.get('[data-testid="sales_order_date"]').type("2026-08-14");

    cy.wait("@getAccountsReceivable");

    cy.get('[data-testid="sales_order_date"]').clear();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getAccountsReceivable");

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
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );

    // pick a product known to have an outstanding balance rather than an
    // arbitrary active product, which may have none
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains(".react-select__option", "Cassava chips")
      .click();

    cy.wait("@getAccountsReceivable");

    cy.contains('[data-testid="table-row"]', "Cassava chips").should(
      "exist",
    );

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  // AMOUNT
  it("Should filter by min amount", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );
    cy.get('[data-testid="sales_order_total_receivable_amount_min"]').type(
      "1",
    );

    cy.wait("@getAccountsReceivable");

    cy.get('[data-testid="sales_order_total_receivable_amount_min"]').clear();
  });

  // PAID
  it("Should filter by min paid", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );
    cy.get('[data-testid="sales_order_paid_amount_min"]').type("1");

    cy.wait("@getAccountsReceivable");

    cy.get('[data-testid="sales_order_paid_amount_min"]').clear();
  });

  // BALANCE
  it("Should filter by min balance", () => {
    cy.intercept("POST", "**/finance-account-receivable/page/*").as(
      "getAccountsReceivable",
    );
    cy.get('[data-testid="sales_order_total_balance_amount_min"]').type("1");

    cy.wait("@getAccountsReceivable");

    cy.get('[data-testid="sales_order_total_balance_amount_min"]').clear();
  });
});
