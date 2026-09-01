describe("Cash Sales Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/cash-sales");
  });

  // ORDER NUMBER
  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");

    cy.get('[data-testid="sales_order_number"]').type("ORD");

    cy.wait("@getCashSales");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_number"]').clear();
  });

  // DATE
  it("Should filter by date", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");

    cy.get('[data-testid="sales_order_date"]').type("2026-08-14");

    cy.wait("@getCashSales");

    cy.get('[data-testid="sales_order_date"]').clear();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getCashSales");

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
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getCashSales");

        cy.contains('[data-testid="table-row"]', productName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  // PAID PER PRODUCT
  it("Should filter by min paid per product", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");
    cy.get('[data-testid="sales_order_paid_per_product_min"]').type("1");

    cy.wait("@getCashSales");

    cy.get('[data-testid="sales_order_paid_per_product_min"]').clear();
  });

  it("Should filter by max paid per product", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");
    cy.get('[data-testid="sales_order_paid_per_product_max"]').type("100000");

    cy.wait("@getCashSales");

    cy.get('[data-testid="sales_order_paid_per_product_max"]').clear();
  });

  // PRODUCT OWNER
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/finance-cash-sales/page/*").as("getCashSales");

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getCashSales");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
