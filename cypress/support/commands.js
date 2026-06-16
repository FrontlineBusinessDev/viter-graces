Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get("input[name=user_account_email]").type(Cypress.env("email"));

  cy.get("input[name=password]").type(Cypress.env("password"));

  cy.get("button[type=submit]").click();

  cy.url().should("not.include", "/login");
});
