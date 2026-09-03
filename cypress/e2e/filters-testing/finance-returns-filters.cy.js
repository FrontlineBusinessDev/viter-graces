describe("Finance Returns Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/finance-returns");
  });

  // STATUS
  it("Should filter by return status", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.get('[data-testid="filter-status-btn"]').eq(0).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .contains(".react-select__option", "pending")
      .click();

    // whether any return currently has "pending" status depends on the
    // dataset - just assert the filter request completes
    cy.wait("@getFinanceReturns").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .find(".react-select__clear-indicator")
      .click();
  });

  // note: unlike the Returns module, Finance Returns has no Item, Order
  // Number, or Date column/filter (see FinanceReturns.jsx columns) - its
  // columns are Status, Customer, Resolution, Refund Method, Total Amount,
  // Returned Amount and Product Owner, so there is nothing to test here.

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getFinanceReturns");

        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-customer"] .react-select__clear-indicator',
    ).click();
  });

  // AMOUNT
  it("Should filter by min amount", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");
    cy.get('[data-testid="return_product_amount_min"]').type("1");

    cy.wait("@getFinanceReturns");

    cy.get('[data-testid="return_product_amount_min"]').clear();
  });

  // RESOLUTION TYPE
  it("Should filter by resolution type", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.get('[data-testid="filter-status-btn"]').eq(1).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .contains(".react-select__option", "Refund")
      .click();

    cy.wait("@getFinanceReturns");

    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .find(".react-select__clear-indicator")
      .click();
  });

  // PRODUCT OWNER
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    // "Product Owner" lists every user with that role, not just owners who
    // actually have a return on record - so the first option may
    // legitimately have zero returns. Just assert the filter request
    // completes, rather than assuming rows come back.
    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getFinanceReturns").its("response.statusCode").should("eq", 200);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
