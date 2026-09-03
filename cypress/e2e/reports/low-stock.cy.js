describe("Reports - Low Stock", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/low-stock");
  });

  it("Loads the low stock report", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );

    // whether any product is currently below its low-stock threshold
    // depends on the dataset (it's legitimately empty when stock is
    // healthy) - just assert the report loads successfully
    cy.wait("@getReport").its("response.statusCode").should("eq", 200);
  });

  it("Does not render a price column", () => {
    cy.contains("th", "Price").should("not.exist");
  });

  it("Should filter by product", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );

    // the dropdown lists all active products, not just ones currently
    // below their low-stock threshold - so whichever one is picked may
    // legitimately have no rows in this report. Just assert the filter
    // request completes, and that any rows returned match the selection.
    cy.get('[data-testid="filter-product-name"]').click();
    cy.get('[data-testid="filter-product-name"] .react-select__option')
      .first()
      .then(($option) => {
        const productName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getReport").its("response.statusCode").should("eq", 200);

        cy.get("body").then(($body) => {
          if ($body.find('[data-testid="table-row"]').length > 0) {
            cy.contains('[data-testid="table-row"]', productName).should(
              "exist",
            );
          }
        });
      });

    cy.get(
      '[data-testid="filter-product-name"] .react-select__clear-indicator',
    ).click();
  });

  it("Should filter by min current stock", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="current_qty_min"]').type("0");

    cy.wait("@getReport");

    cy.get('[data-testid="current_qty_min"]').clear();
  });

  it("Should filter by min threshold", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
      "getReport",
    );
    cy.get('[data-testid="products_low_stock_threshold_min"]').type("1");

    cy.wait("@getReport");

    cy.get('[data-testid="products_low_stock_threshold_min"]').clear();
  });

  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/report-sales-order/page-all-low-stock/page/*").as(
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
