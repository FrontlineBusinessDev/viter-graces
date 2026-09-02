describe("Reports - Returns Report", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/returns-reports");
  });

  it("Loads the returns report", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Should filter by status", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-status-btn"]').eq(0).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .contains(".react-select__option", "pending")
      .click();

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .find(".react-select__clear-indicator")
      .click();
  });

  it("Should filter the return number as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="return_product_number"]').type("RET");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_number"]').clear();
  });

  it("Should filter by date", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="return_product_date"]').type("2026-08-14");

    cy.wait("@getReport");

    cy.get('[data-testid="return_product_date"]').clear();
  });

  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="return_product_order_number"]').type("ORD");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_order_number"]').clear();
  });

  it("Should filter by customer", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getReport");

        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-customer"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by product", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    // pick a product known to have an existing return rather than an
    // arbitrary active product, which may have none
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"]')
      .contains(".react-select__option", "Cassava chips")
      .click();

    cy.wait("@getReport");

    cy.contains('[data-testid="table-row"]', "Cassava chips").should(
      "exist",
    );

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by min amount", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="return_product_amount_min"]').type("1");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_amount_min"]').clear();
  });

  it("Should filter the reason as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="return_product_reason"]').type("Damage");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="return_product_reason"]').clear();
  });

  it("Should filter by resolution type", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-status-btn"]').eq(1).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .contains(".react-select__option", "Refund")
      .click();

    cy.wait("@getReport");

    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .find(".react-select__clear-indicator")
      .click();
  });

  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-returns/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getReport");

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });
});
