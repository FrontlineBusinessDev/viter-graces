describe("Roles Module - CRUD and Search Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/roles");
  });

  //CREATE
  it("Create role", () => {
    //cancel button
    cy.get('[data-testid="add-roles-btn"]').click();
    cy.get('input[name="role_name"]').type("Test Role");
    cy.get('textarea[name="role_description"]').type("Test role only");
    cy.get('[data-testid="false"]').click();

    //close btn
    cy.get('[data-testid="add-roles-btn"]').click();
    cy.get('input[name="role_name"]').type("Test Role");
    cy.get('textarea[name="role_description"]').type("Test role only");
    cy.get('[data-testid="close-btn"]').click();

    //save btn
    cy.get('[data-testid="add-roles-btn"]').click();
    cy.get('input[name="role_name"]').type("Test Role");
    cy.get('textarea[name="role_description"]').type("Test role only");

    cy.intercept("POST", "**/roles").as("createRole");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createRole");

    cy.contains("Test Role", { timeout: 1000 }).should("exist");
  });

  it("Update role", () => {
    cy.intercept("POST", "**/roles").as("createRole");
    cy.intercept("PUT",)
  });
});
