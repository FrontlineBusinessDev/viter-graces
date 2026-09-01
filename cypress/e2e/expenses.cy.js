describe("Expenses Module - CRUD Flow", () => {
  // unique per run so re-running the suite never collides with a
  // previous run's expense - the paid amount is shown directly in the
  // "PAID AMOUNT" column and is otherwise free-form
  const runId = Date.now();
  const uniqueAmount = String(100 + (runId % 900));

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/expenses");
  });

  // CREATE
  it("Create an expense", () => {
    cy.intercept("POST", "**/finance-expenses").as("createExpense");

    // there is no data-testid on the add button - it's labelled from the
    // InfiniteTable path prop ("finance-expenses" -> "finance expenses")
    cy.contains("button", /finance expenses/i).click();

    // date and payment status ("Paid") default to sensible values already
    cy.get('.modal-body [data-testid="purchase_order_product_id"]').click();
    cy.get('.modal-body [data-testid="purchase_order_product_id"]')
      .find('[id$="-option-0"]')
      .click();

    cy.get('.modal-body [data-testid="purchase_order_payment"]')
      .clear()
      .type(uniqueAmount);

    cy.get('.modal-body textarea[name="purchase_order_note"]').type(
      "Cypress test expense",
    );

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createExpense").its("response.statusCode").should("eq", 200);

    cy.contains('[data-testid="table-row"]', uniqueAmount, {
      timeout: 15000,
    }).should("exist");
  });

  // VALIDATION
  it("Blocks submission when required fields are empty", () => {
    cy.intercept("POST", "**/finance-expenses").as("createExpense");

    cy.contains("button", /finance expenses/i).click();

    cy.get('.modal-body [data-testid="purchase_order_payment"]', {
      timeout: 10000,
    }).should("be.visible");

    // Amount defaults to 0 and Yup requires a non-empty value - clear it.
    // The save button isn't visually disabled for an invalid amount, but
    // Formik's validationSchema blocks the actual submit, so assert on
    // that instead of a disabled attribute that doesn't exist here
    cy.get('.modal-body [data-testid="purchase_order_payment"]').clear();

    cy.get('[data-testid="save-product-btn"]').click();

    cy.get("@createExpense.all").should("have.length", 0);
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.contains("button", /finance expenses/i).click();

    cy.get('.modal-body textarea[name="purchase_order_note"]', {
      timeout: 10000,
    }).type("Cypress Cancel Test");

    cy.get('[data-testid="false"]').click();

    cy.get('.modal-body textarea[name="purchase_order_note"]').should(
      "not.exist",
    );
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.contains("button", /finance expenses/i).click();

    cy.get('.modal-body textarea[name="purchase_order_note"]', {
      timeout: 10000,
    }).type("Cypress Close Test");

    cy.get('[data-testid="close-btn"]').click();

    cy.get('.modal-body textarea[name="purchase_order_note"]').should(
      "not.exist",
    );
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // ARCHIVE
  it("Archive an expense", () => {
    cy.intercept("PUT", "**/finance-expenses/**").as("archiveExpense");

    cy.contains('[data-testid="table-row"]', uniqueAmount, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveExpense").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore an expense", () => {
    cy.intercept("PUT", "**/finance-expenses/**").as("restoreExpense");

    // archived rows sort after active ones - give the infinite-scroll
    // table a generous timeout to load down to it
    cy.contains('[data-testid="table-row"]', uniqueAmount, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]').click({ force: true });
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreExpense").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });
});
