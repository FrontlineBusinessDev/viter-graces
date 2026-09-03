describe("Sales Orders Module - CRUD Flow", () => {
  // unique per run so re-running the suite never collides with a
  // previous run's order when looking rows up by their notes text
  const runId = Date.now();
  const orderNotes = `Cypress order ${runId}`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    // this table has enough columns to need horizontal scroll at the
    // default width - a wide viewport keeps the action buttons in view
    // without fighting Cypress's scroll-into-view on both axes at once
    cy.viewport(1920, 900);
    cy.visit("/developer/sales-orders");
  });

  // CREATE
  it("Create sales order", () => {
    cy.intercept("POST", "**/sales-order").as("createSalesOrder");

    cy.contains("button", /sales order/i).click();

    cy.get('input[name="sales_order_date"]', { timeout: 10000 }).should(
      "not.have.value",
      "",
    );

    // explicitly pick a customer instead of trusting the async "Walk in
    // customer" default to have resolved by the time we interact with it
    cy.get('[data-testid="sales_order_customer_id"]').click();
    cy.get('[data-testid="sales_order_customer_id"]').find('[id$="-option-0"]')
      .first()
      .click();

    // pick the first product for the default line item row
    cy.get('[data-testid="sales_order_product_name"]').click();
    cy.get('[data-testid="sales_order_product_name"]')
      .find('[id$="-option-0"]')
      .click();

    cy.get('textarea[name="sales_order_notes"]').type(orderNotes);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createSalesOrder").its("response.statusCode").should("eq", 200);

    cy.contains('[data-testid="table-row"]', orderNotes, {
      timeout: 15000,
    }).should("exist");
  });

  // VALIDATION
  it("Blocks submission when the required customer is cleared", () => {
    cy.intercept("POST", "**/sales-order").as("createSalesOrder");

    cy.contains("button", /sales order/i).click();

    cy.get('[data-testid="sales_order_customer_id"]', {
      timeout: 10000,
    }).should("be.visible");

    // select a customer so a clear indicator exists, then clear the
    // now-empty required field
    cy.get('[data-testid="sales_order_customer_id"]').click();
    cy.get('[data-testid="sales_order_customer_id"]').find('[id$="-option-0"]')
      .first()
      .click();

    // this select has no classed clear-indicator - its first indicator
    // icon (before the separator/dropdown-arrow) is the clear button
    cy.get('[data-testid="sales_order_customer_id"] [aria-hidden="true"]')
      .first()
      .click();

    // the save button isn't visually disabled for an invalid customer,
    // but Formik's validationSchema blocks the actual submit - assert on
    // that instead of a disabled attribute that doesn't exist here
    cy.get('[data-testid="save-product-btn"]').click();

    cy.get("@createSalesOrder.all").should("have.length", 0);
  });

  // CANCEL
  it("Cancel button closes Add modal without saving", () => {
    cy.contains("button", /sales order/i).click();

    // the notes field sits below the fold of the modal's internal scroll
    // area - typing auto-scrolls it into view, an explicit visibility
    // check beforehand does not
    cy.get('textarea[name="sales_order_notes"]', { timeout: 10000 }).type(
      "Cypress Cancel Test",
    );

    cy.get('[data-testid="false"]').click();

    cy.get('textarea[name="sales_order_notes"]').should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes Add modal without saving", () => {
    cy.contains("button", /sales order/i).click();

    cy.get('textarea[name="sales_order_notes"]', { timeout: 10000 }).type(
      "Cypress Close Test",
    );

    cy.get('[data-testid="close-btn"]').click();

    cy.get('textarea[name="sales_order_notes"]').should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // VIEW
  it("View order details", () => {
    cy.contains('[data-testid="table-row"]', orderNotes, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-view"]').click({ force: true });
    });

    cy.contains("Order Details").should("be.visible");
    cy.contains(orderNotes).should("exist");

    cy.get('[data-testid="close-btn"]').click();
  });

  // ARCHIVE - CANCEL
  it("Archive sales order - cancel keeps it active", () => {
    cy.intercept("PUT", "**/sales-order/**").as("archiveSalesOrder");

    cy.contains('[data-testid="table-row"]', orderNotes, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]').click({ force: true });
    });

    cy.contains("button", "Cancel").click();

    cy.get("@archiveSalesOrder.all").should("have.length", 0);

    cy.contains('[data-testid="table-row"]', orderNotes).within(() => {
      cy.get('[data-testid="action-archive"]').should("exist");
    });
  });

  // ARCHIVE
  it("Archive sales order", () => {
    cy.intercept("PUT", "**/sales-order/**").as("archiveSalesOrder");

    cy.contains('[data-testid="table-row"]', orderNotes, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveSalesOrder")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE - CANCEL
  it("Restore sales order - cancel keeps it archived", () => {
    cy.intercept("PUT", "**/sales-order/**").as("restoreSalesOrder");

    cy.contains('[data-testid="table-row"]', orderNotes, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]').click({ force: true });
    });

    cy.contains("button", "Cancel").click();

    cy.get("@restoreSalesOrder.all").should("have.length", 0);

    cy.contains('[data-testid="table-row"]', orderNotes).within(() => {
      cy.get('[data-testid="action-restore"]').should("exist");
    });
  });

  // RESTORE
  it("Restore sales order", () => {
    cy.intercept("PUT", "**/sales-order/**").as("restoreSalesOrder");

    cy.contains('[data-testid="table-row"]', orderNotes, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreSalesOrder")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });
});
