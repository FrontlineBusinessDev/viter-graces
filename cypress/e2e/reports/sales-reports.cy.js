describe("Reports - Sales Reports", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/sales-reports");
  });

  it("Loads the sales report", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains("Total Sales").should("be.visible");
  });

  it("Does not render an add button", () => {
    cy.contains("button", /sales reports/i).should("not.exist");
  });

  it("Should filter by status", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "paid")
      .click();

    cy.wait("@getReport");

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="sales_order_number"]').type("ORD");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_number"]').clear();
  });

  it("Should filter by date", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="sales_order_date"]').type("2026-08-14");

    cy.wait("@getReport");

    cy.get('[data-testid="sales_order_date"]').clear();
  });

  it("Should filter by product", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getReport");

        cy.contains('[data-testid="table-row"]', productName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by customer", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
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

  it("Should filter by min amount", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="sales_order_discounted_with_vat_amount_min"]').type(
      "1",
    );

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_discounted_with_vat_amount_min"]').clear();
  });

  it("Should filter the payment method as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="sales_order_payment_method"]').type("cash");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_order_payment_method"]').clear();
  });

  // NOTE: the Product Owner and Created By columns both pass the same
  // testFilterId="filter-owner" (SalesReports.jsx) - as an admin/developer
  // both columns render at once, so this testid matches 2 elements
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="filter-owner"]').eq(0).click();
    cy.get('[data-testid="filter-owner"]')
      .eq(0)
      .find(".react-select__option")
      .first()
      .click();

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-owner"]')
      .eq(0)
      .find(".react-select__clear-indicator")
      .click();
  });

  it("Should filter the notes as the user types", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-sales-order/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="sales_order_notes"]').type("test");

    cy.wait("@getReport");
    cy.wait(1000);

    cy.get('[data-testid="sales_order_notes"]').clear();
  });
});
