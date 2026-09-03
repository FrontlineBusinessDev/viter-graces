describe("Purchase Movement History Module - Create", () => {
  const runId = Date.now();
  const transferNote = `Cypress test transfer ${runId}`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/purchase-movement-history");
  });

  // this page has no actions column - it's an append-only ledger, the
  // only interaction is creating a new transfer
  it("Create a stock transfer", () => {
    cy.intercept("POST", "**/purchase-order-movement").as("createTransfer");

    cy.contains("button", /transfer supply/i).click();

    // pick a PO known to be "received" (has transferable stock) rather
    // than an arbitrary one, which may still be draft/sent with 0
    // available quantity and fail server-side "Invalid quantity" checks
    cy.get('.modal-body [data-testid="purchase_order_product_name"]', {
      timeout: 10000,
    }).click();
    cy.get('.modal-body [data-testid="purchase_order_product_name"]')
      .contains('[id*="-option-"]', "PO-006")
      .click();

    // "purchase_order_number" is also used by this list page's own PO#
    // filter column, so it must be scoped to the modal to get a single match
    cy.get('.modal-body [data-testid="purchase_order_number"]', {
      timeout: 10000,
    }).click();
    cy.get('.modal-body [data-testid="purchase_order_number"]')
      .find('[id*="-option-"]')
      .first()
      .click();

    cy.get('.modal-body [data-testid="sales_order_product_name"]').click();
    cy.get('.modal-body [data-testid="sales_order_product_name"]')
      .find('[id*="-option-"]')
      .first()
      .click();

    // qty has no name/data-testid - it's a plain number input in the row,
    // required server-side even though nothing blocks submitting it empty
    // client-side
    cy.get('.modal-body input[placeholder="Qty"]').type("1");

    cy.get('.modal-body textarea[name="purchase_order_transfer_note"]').type(
      transferNote,
    );

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createTransfer")
      .its("response.statusCode")
      .should("eq", 200);

    cy.contains('[data-testid="table-row"]', transferNote, {
      timeout: 15000,
    }).should("exist");
  });

  // VALIDATION
  it("Shows a validation error when the transfer note is left empty", () => {
    cy.contains("button", /transfer supply/i).click();

    cy.get(
      '.modal-body textarea[name="purchase_order_transfer_note"]',
      { timeout: 10000 },
    )
      .should("be.visible")
      .focus()
      .blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.contains("button", /transfer supply/i).click();

    cy.get('.modal-body textarea[name="purchase_order_transfer_note"]', {
      timeout: 10000,
    }).type("Cypress Cancel Test");

    cy.get('[data-testid="false"]').click();

    cy.get(
      '.modal-body textarea[name="purchase_order_transfer_note"]',
    ).should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.contains("button", /transfer supply/i).click();

    cy.get('.modal-body textarea[name="purchase_order_transfer_note"]', {
      timeout: 10000,
    }).type("Cypress Close Test");

    cy.get('[data-testid="close-btn"]').click();

    cy.get(
      '.modal-body textarea[name="purchase_order_transfer_note"]',
    ).should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  it("Does not render row action buttons", () => {
    cy.get('[data-testid="table-row"]', { timeout: 15000 })
      .first()
      .find('[data-testid="action-edit"]')
      .should("not.exist");
  });
});
