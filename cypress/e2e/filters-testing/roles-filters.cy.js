describe("Role Module - Filter", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/roles");
  });

  //SEARCH
  it("Search role name", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.get('[data-testid="role_name"]').type("Test Role");

    cy.wait("@getRole");

    cy.contains("Test Role", { timeout: 1000 }).should("exist");
  });

  it("Search role description", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.get('[data-testid="role_description"]').type("updated");

    cy.wait("@getRole");

    cy.contains("updated", { timeout: 1000 }).should("exist");
  });
});
