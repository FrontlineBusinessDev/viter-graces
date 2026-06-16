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
});
