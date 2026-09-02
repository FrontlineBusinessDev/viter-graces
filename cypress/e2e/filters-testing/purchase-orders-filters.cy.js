describe("Purchase Orders Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/purchase-orders");
  });

  // STATUS
  it("Should filter by status", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");

    cy.get('[data-testid="filter-status-btn"]').eq(0).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .contains(".react-select__option", "sent")
      .click();

    cy.wait("@getPOs");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-status-btn"]')
      .eq(0)
      .find(".react-select__clear-indicator")
      .click();
  });

  // PAYMENT STATUS
  it("Should filter by payment status", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");

    cy.get('[data-testid="filter-status-btn"]').eq(1).click();
    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .contains(".react-select__option", "unpaid")
      .click();

    cy.wait("@getPOs");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="filter-status-btn"]')
      .eq(1)
      .find(".react-select__clear-indicator")
      .click();
  });

  // PO NUMBER
  it("Should filter the PO number as the user types", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");

    cy.get('[data-testid="purchase_order_number"]').type("PO");

    cy.wait("@getPOs");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_number"]').clear();
  });

  // SUPPLIER
  it("Should filter by supplier", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");

    cy.get('[data-testid="filter-supplier"]').click();
    cy.get('[data-testid="filter-supplier"] .react-select__option')
      .first()
      .then(($option) => {
        const supplierName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getPOs");

        cy.contains('[data-testid="table-row"]', supplierName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-supplier"] .react-select__clear-indicator',
    ).click();
  });

  // ORDER DATE
  it("Should filter by order date", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");

    cy.get('[data-testid="formated_date"]').type("2026-08-25");

    cy.wait("@getPOs");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="formated_date"]').clear();
  });

  // EXPECTED DELIVERY
  it("Should filter by expected delivery date", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");

    cy.get('[data-testid="formated_delivery_date"]').type("2026-08-31");

    cy.wait("@getPOs");

    cy.get('[data-testid="formated_delivery_date"]').clear();
  });

  // PAID AMOUNT
  it("Should filter by min paid amount", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");
    cy.get('[data-testid="purchase_order_payment_min"]').type("1");

    cy.wait("@getPOs");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_payment_min"]').clear();
  });

  // BALANCE
  it("Should filter by min balance", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");
    cy.get('[data-testid="purchase_order_balance_min"]').type("1");

    cy.wait("@getPOs");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_balance_min"]').clear();
  });
});
