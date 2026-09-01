describe("Expenses Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/expenses");
  });

  // SUPPLIER
  it("Should filter the supplier as the user types", () => {
    cy.intercept("POST", "**/finance-expenses/page/*").as("getExpenses");

    cy.get('[data-testid="purchase_order_supplier_name"]').type("Banana");

    cy.wait("@getExpenses");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_supplier_name"]').clear();
  });

  // PO NUMBER
  it("Should filter the PO number as the user types", () => {
    cy.intercept("POST", "**/finance-expenses/page/*").as("getExpenses");

    cy.get('[data-testid="purchase_order_number"]').type("PO");

    cy.wait("@getExpenses");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_number"]').clear();
  });

  // PRODUCT
  // NOTE: this filter's options come from the sales Products catalog
  // (path="products/read-all-by-active" in Expenses.jsx), but the rows
  // it filters are supplier/expense items ("saging", "Electricity
  // Bills", ...) from a different catalog entirely - no option here will
  // ever match a row, so this only exercises the request, not the result
  it("Should send a request when filtering by product", () => {
    cy.intercept("POST", "**/finance-expenses/page/*").as("getExpenses");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .click();

    cy.wait("@getExpenses");

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  // PAID AMOUNT
  it("Should filter by min paid amount", () => {
    cy.intercept("POST", "**/finance-expenses/page/*").as("getExpenses");
    cy.get('[data-testid="purchase_order_total_paid_per_product_min"]').type(
      "1",
    );

    cy.wait("@getExpenses");

    cy.get(
      '[data-testid="purchase_order_total_paid_per_product_min"]',
    ).clear();
  });

  it("Should filter by max paid amount", () => {
    cy.intercept("POST", "**/finance-expenses/page/*").as("getExpenses");
    cy.get('[data-testid="purchase_order_total_paid_per_product_max"]').type(
      "100000",
    );

    cy.wait("@getExpenses");

    cy.get(
      '[data-testid="purchase_order_total_paid_per_product_max"]',
    ).clear();
  });

  // PRODUCT OWNER
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/finance-expenses/page/*").as("getExpenses");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getExpenses");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
