describe("Users Module - CRUD Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.visit("/login");

      cy.get("input[name=user_account_email]").type(Cypress.env("email"));

      cy.get("input[name=password]").type(Cypress.env("password"));

      cy.get("button[type=submit]").click();

      cy.url().should("not.include", "/login");
    });

    cy.visit("/developer/users");
  });

  //CREATE
  it("Creates a new user account", () => {
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="user_account_role_id"]').select(1);
    cy.get('input[name="user_account_first_name"]').type("Jamie");
  });
});
