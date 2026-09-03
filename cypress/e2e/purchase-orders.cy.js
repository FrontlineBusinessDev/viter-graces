describe("Purchase Orders Module - CRUD Flow", () => {
  const runId = Date.now();
  const orderNote = `Cypress test PO ${runId}`;
  // the PO number is server-generated and there's no notes column in the
  // list table, so capture the number of the just-created row and reuse
  // it to locate the row in later tests instead of the (invisible) note
  let poNumber = "";

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.viewport(1920, 900);
    cy.visit("/developer/purchase-orders");
  });

  // CREATE
  it("Create a purchase order", () => {
    cy.intercept("POST", "**/purchase-order").as("createPO");

    cy.contains("button", /purchase order/i).click();

    // pick a supplier - the default line item row is already present with
    // qty=1, price auto-fills once a product is chosen
    cy.get('[data-testid="purchase_order_supplier_id"]').click();
    cy.get('[data-testid="purchase_order_supplier_id"]')
      .find('[id$="-option-0"]')
      .click();

    cy.get('[data-testid="sales_order_product_name"]').click();
    cy.get('[data-testid="sales_order_product_name"]')
      .find('[id$="-option-0"]')
      .click();

    cy.get('[data-testid="purchase_order_product_owner_name"]').click();
    cy.get('[data-testid="purchase_order_product_owner_name"]')
      .find('[id$="-option-0"]')
      .click();

    cy.get('.modal-body [data-testid="purchase_order_note"]').type(
      orderNote,
    );

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createPO").its("response.statusCode").should("eq", 200);

    // the newest order sorts to the top of the (unfiltered, active-first)
    // list - grab its PO number for later tests
    cy.get('[data-testid="table-row"]', { timeout: 15000 })
      .first()
      .invoke("text")
      .then((text) => {
        const match = text.match(/PO-\d+/);
        expect(match, `a PO number in row text: "${text}"`).to.not.be.null;
        poNumber = match[0];
      });
  });

  // VALIDATION
  it("Blocks submission when the required supplier is cleared", () => {
    cy.intercept("POST", "**/purchase-order").as("createPO");

    cy.contains("button", /purchase order/i).click();

    cy.get('[data-testid="purchase_order_supplier_id"]', {
      timeout: 10000,
    }).should("be.visible");

    cy.get('[data-testid="purchase_order_supplier_id"]').click();
    cy.get('[data-testid="purchase_order_supplier_id"]')
      .find('[id$="-option-0"]')
      .click();

    cy.get('[data-testid="purchase_order_supplier_id"] [aria-hidden="true"]')
      .first()
      .click();

    cy.get('[data-testid="save-product-btn"]').click();

    cy.get("@createPO.all").should("have.length", 0);
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.contains("button", /purchase order/i).click();

    cy.get('.modal-body [data-testid="purchase_order_note"]', {
      timeout: 10000,
    }).type("Cypress Cancel Test");

    cy.get('[data-testid="false"]').click();

    cy.get('.modal-body [data-testid="purchase_order_note"]').should(
      "not.exist",
    );
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.contains("button", /purchase order/i).click();

    cy.get('.modal-body [data-testid="purchase_order_note"]', {
      timeout: 10000,
    }).type("Cypress Close Test");

    cy.get('[data-testid="close-btn"]').click();

    cy.get('.modal-body [data-testid="purchase_order_note"]').should(
      "not.exist",
    );
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // ARCHIVE
  it("Archive a purchase order", () => {
    cy.intercept("PUT", "**/purchase-order/**").as("archivePO");

    cy.contains('[data-testid="table-row"]', poNumber, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archivePO").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore a purchase order", () => {
    cy.intercept("PUT", "**/purchase-order/**").as("restorePO");

    cy.contains('[data-testid="table-row"]', poNumber, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@restorePO").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Delete a purchase order", () => {
    cy.intercept("POST", "**/purchase-order/page/*").as("getPOs");
    cy.intercept("PUT", "**/purchase-order/**").as("archivePO");
    cy.intercept("DELETE", "**/purchase-order/**").as("deletePO");

    cy.contains('[data-testid="table-row"]', poNumber, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archivePO");
    cy.wait("@getPOs");

    cy.contains('[data-testid="table-row"]', poNumber, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-delete"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deletePO").its("response.statusCode").should("eq", 200);
  });
});
