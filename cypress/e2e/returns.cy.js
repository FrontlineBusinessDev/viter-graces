describe("Returns Module - CRUD Flow", () => {
  // unique per run so re-running the suite never collides with a
  // previous run's return when looking rows up - the "reason" column
  // displays this value directly since the reason field defaults to "Other"
  const runId = Date.now();
  const returnReason = `Cypress reason ${runId}`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/returns");
  });

  // CREATE
  it("Create a return", () => {
    cy.intercept("POST", "**/returns-products").as("createReturn");

    // there is no data-testid on the add button - it's labelled from the
    // InfiniteTable path prop ("returns-products" -> "returns products")
    cy.contains("button", /returns products/i).click();

    // "Other" is the default reason, so the free-text reason field is
    // already visible
    cy.get('.modal-body [data-testid="return_product_resolution_type"]')
      .select("refund");

    cy.get('.modal-body [data-testid="other_reason"]').type(returnReason);

    // link an existing sales order and pick its first line item
    cy.get('[data-testid="sales_order_product_name"]').click();
    cy.get('[data-testid="sales_order_product_name"]')
      .find('[id$="-option-0"]')
      .click();

    cy.contains(".modal-body p", "Select Items to Return")
      .next()
      .find("button")
      .first()
      .click();

    cy.get('.modal-body input[type="number"]').first().clear().type("1");

    cy.get('.modal-body textarea[name="return_product_notes"]').type(
      "Cypress test notes",
    );

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createReturn").its("response.statusCode").should("eq", 200);

    cy.contains('[data-testid="table-row"]', returnReason, {
      timeout: 15000,
    }).should("exist");
  });

  // VALIDATION
  it("Shows a validation error when notes is left empty", () => {
    cy.contains("button", /returns products/i).click();

    cy.get('.modal-body textarea[name="return_product_notes"]', {
      timeout: 10000,
    })
      .should("be.visible")
      .focus()
      .blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
    cy.contains(".error-show", "Required").should("exist");
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.contains("button", /returns products/i).click();

    cy.get('.modal-body [data-testid="other_reason"]', {
      timeout: 10000,
    }).type("Cypress Cancel Test");

    cy.get('[data-testid="false"]').click();

    cy.get('.modal-body [data-testid="other_reason"]').should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.contains("button", /returns products/i).click();

    cy.get('.modal-body [data-testid="other_reason"]', {
      timeout: 10000,
    }).type("Cypress Close Test");

    cy.get('[data-testid="close-btn"]').click();

    cy.get('.modal-body [data-testid="other_reason"]').should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // STATUS
  it("Updates the return status from the inline table dropdown", () => {
    cy.intercept("PUT", "**/returns-products/**").as("updateStatus");

    cy.contains('[data-testid="table-row"]', returnReason, {
      timeout: 15000,
    })
      .find("select")
      .select("processed", { force: true });

    cy.wait("@updateStatus").its("response.statusCode").should("eq", 200);

    cy.contains('[data-testid="table-row"]', returnReason)
      .find("select")
      .should("have.value", "processed");
  });
});
