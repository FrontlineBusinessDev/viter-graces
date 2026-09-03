describe("Movement History Module - Create", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });

    cy.visit("/developer/movement-history");
  });

  it("Create stock movement", () => {
    cy.viewport(1280, 720);

    cy.intercept("POST", "**/stock-movement").as("createStockMovement");

    cy.get('[data-testid="add-stocks-btn"]').click();

    cy.get('input[name="stock_movement_qty"]').type("90");
    cy.get('input[name="stock_movement_location"]').type("Dolores, Quezon");
    cy.get('textarea[name="stock_movement_notes"]').type(
      "This is test stock overview",
    );

    // dropdowns
    cy.get('[data-testid="select-stock-movement"]').select(1);
    cy.get('[data-testid="select-movement-type"]').select(2);

    // IMPORTANT: ensure intercept is active before click
    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createStockMovement")
      .its("response.statusCode")
      .should("eq", 200);

    // safer assertion
    cy.contains("90", { timeout: 15000 }).should("exist");
  });

  // VALIDATION
  it("Shows validation errors when required fields are empty", () => {
    cy.get('[data-testid="add-stocks-btn"]').click();

    cy.get('input[name="stock_movement_qty"]', { timeout: 10000 }).should(
      "be.visible",
    );

    // touch and clear required fields to trigger Formik validation
    cy.get('input[name="stock_movement_qty"]').type("1").clear().blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
    cy.contains(".error-show", "Required").should("exist");

    // save button should still be present - i.e. nothing was submitted
    cy.get('input[name="stock_movement_qty"]').should("exist");
  });

  // CANCEL
  it("Cancel button closes Add modal without saving", () => {
    cy.get('[data-testid="add-stocks-btn"]').click();

    cy.get('input[name="stock_movement_qty"]', { timeout: 10000 })
      .should("be.visible")
      .type("123");

    cy.get('[data-testid="false"]').click();

    cy.get('input[name="stock_movement_qty"]').should("not.exist");
    cy.contains("123").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes Add modal without saving", () => {
    cy.get('[data-testid="add-stocks-btn"]').click();

    cy.get('input[name="stock_movement_qty"]', { timeout: 10000 })
      .should("be.visible")
      .type("456");

    cy.get('[data-testid="close-btn"]').click();

    cy.get('input[name="stock_movement_qty"]').should("not.exist");
    cy.contains("456").should("not.exist");
  });
});
