describe("Users Module - CRUD Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });

    cy.visit("/developer/users");
  });

  //CREATE
  it("Creates a new user account", () => {
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]').select(1);
    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Mae");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.get('[data-testid="false"]').click();

    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]').select(1);
    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Mae");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );
    cy.get('[data-testid="close-btn"]').click();

    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]').select(2);
    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Mae");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.get('[data-testid="save-product-btn"]').click();
  });

  //UPDATE
  
});
