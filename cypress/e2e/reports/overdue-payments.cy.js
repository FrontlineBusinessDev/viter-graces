describe("Reports - Overdue Payments", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/overdue-payments");
  });

  it("Loads the overdue payments report", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-overdue-payment/page/*",
    ).as("getReport");

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Should filter by due date", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-overdue-payment/page/*",
    ).as("getReport");

    cy.get('[data-testid="installment_payment_due_date"]').type(
      "2026-08-14",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="installment_payment_due_date"]').clear();
  });

  it("Should filter by customer", () => {
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-overdue-payment/page/*",
    ).as("getReport");

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
    cy.intercept(
      "POST",
      "**/report-sales-order/page-all-overdue-payment/page/*",
    ).as("getReport");
    cy.get('[data-testid="installment_payment_amount_min"]').type("1");

    cy.wait("@getReport");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="installment_payment_amount_min"]').clear();
  });
});
