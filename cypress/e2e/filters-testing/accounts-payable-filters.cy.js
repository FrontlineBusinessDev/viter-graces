describe("Accounts Payable Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/accounts-payable");
  });

  // PO NUMBER
  it("Should filter the PO number as the user types", () => {
    cy.intercept("POST", "**/finance-account-payable/page/*").as(
      "getAccountsPayable",
    );

    cy.get('[data-testid="purchase_order_number"]').type("PO");

    cy.wait("@getAccountsPayable");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_number"]').clear();
  });

  // DATE
  it("Should filter by purchase date", () => {
    cy.intercept("POST", "**/finance-account-payable/page/*").as(
      "getAccountsPayable",
    );

    cy.get('[data-testid="purchase_order_date"]').type("2026-08-14");

    cy.wait("@getAccountsPayable");

    cy.get('[data-testid="purchase_order_date"]').clear();
  });

  // PRODUCT
  // NOTE: this filter's options come from the sales Products catalog
  // (path="products/read-all-by-active" in AccountsPayable.jsx), but the
  // rows it filters are supplier purchase-order items ("saging", ...)
  // from a different catalog entirely - no option here will ever match a
  // row, so this only exercises the request, not the result
  it("Should send a request when filtering by product", () => {
    cy.intercept("POST", "**/finance-account-payable/page/*").as(
      "getAccountsPayable",
    );

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .click();

    cy.wait("@getAccountsPayable");

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  // SUPPLIER
  it("Should filter the supplier as the user types", () => {
    cy.intercept("POST", "**/finance-account-payable/page/*").as(
      "getAccountsPayable",
    );

    cy.get('[data-testid="purchase_order_supplier_name"]').type("Banana");

    cy.wait("@getAccountsPayable");
    cy.wait(1000);

    cy.get('[data-testid="purchase_order_supplier_name"]').clear();
  });
});
