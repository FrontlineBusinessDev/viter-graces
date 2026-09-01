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

    cy.wait("@getFinanceReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .find(".react-select__clear-indicator")
      .click();
  });

  // PRODUCT
  it("Should filter the item as the user types", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.get('[data-testid="return_product_product_name"]').type("Cassava");

    cy.wait("@getFinanceReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_product_name"]').clear();
  });

  // ORDER NUMBER
  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.get('[data-testid="return_product_order_number"]').type("ORD");

    cy.wait("@getFinanceReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_order_number"]').clear();
  });

  // DATE
  it("Should filter by date", () => {
    cy.intercept("POST", "**/finance-returns/page/*").as("getFinanceReturns");

    cy.get('[data-testid="return_product_date"]').type("2026-08-14");

    cy.wait("@getFinanceReturns");

    cy.get('[data-testid="return_product_date"]').clear();
  });

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

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getFinanceReturns");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
