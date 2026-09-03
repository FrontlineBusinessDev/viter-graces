describe("Purchase Movement History Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/purchase-movement-history");
  });

  // STATUS
  it("Should filter by status", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );

    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "TRANSFERRED")
      .click();

    cy.wait("@getMovements");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  // PO NUMBER
  it("Should filter the PO number as the user types", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );

    cy.get('[data-testid="purchase_order_number"]').type("PO");

    cy.wait("@getMovements");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_number"]').clear();
  });

  // SUPPLIER
  it("Should filter by supplier", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );

    cy.get('[data-testid="filter-supplier"]').click();
    cy.get('[data-testid="filter-supplier"] .react-select__option')
      .first()
      .then(($option) => {
        const supplierName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getMovements");

        cy.contains('[data-testid="table-row"]', supplierName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-supplier"] .react-select__clear-indicator',
    ).click();
  });

  // PRODUCT OWNER
  it("Should filter by product owner", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );

    cy.get('[data-testid="filter-owner"]').click();
    cy.get('[data-testid="filter-owner"] .react-select__option')
      .first()
      .click();

    cy.wait("@getMovements");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get(
      '[data-testid="filter-owner"] .react-select__clear-indicator',
    ).click();
  });

  // QUANTITY
  it("Should filter by min quantity", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );
    cy.get('[data-testid="purchase_order_qty_min"]').type("1");

    cy.wait("@getMovements");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_qty_min"]').clear();
  });

  // BEFORE
  it("Should filter by min before qty", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );
    cy.get('[data-testid="purchase_order_before_qty_min"]').type("0");

    cy.wait("@getMovements");

    cy.get('[data-testid="purchase_order_before_qty_min"]').clear();
  });

  // AFTER
  it("Should filter by min after qty", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );
    cy.get('[data-testid="purchase_order_after_qty_min"]').type("1");

    cy.wait("@getMovements");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="purchase_order_after_qty_min"]').clear();
  });

  // ORDER DATE
  it("Should filter by order date", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );

    cy.get('[data-testid="formated_date"]').type("2026-08-25");

    cy.wait("@getMovements");

    cy.get('[data-testid="formated_date"]').clear();
  });

  // NOTE
  it("Should filter the note as the user types", () => {
    cy.intercept("POST", "**/purchase-order-movement/page/*").as(
      "getMovements",
    );

    cy.get('[data-testid="purchase_order_transfer_note"]').type("test");

    cy.wait("@getMovements");
    cy.wait(1000);

    cy.get('[data-testid="purchase_order_transfer_note"]').clear();
  });
});
