describe("Product Owner - CRUD and Search Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });

    cy.visit("developer/product-owner");
  });

  //CREATE
  it("Creates a new product owner", () => {
    //cancel
    cy.get('[data-testid="add-product-owner-btn"]').click();

    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Torres");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.get('[data-testid="false"]').click();

    //close
    cy.get('[data-testid="add-product-owner-btn"]').click();

    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Torres");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.get('[data-testid="close-btn"]').click();

    //save
    cy.get('[data-testid="add-product-owner-btn"]').click();

    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Torres");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.intercept("POST", "**/product-owner").as("createProductOwner");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createProductOwner");

    cy.contains("Herlyn", { timeout: 1000 }).should("exist");
  });

  // UPDATE
  it("Update product owner", () => {
    //cancel btn

    cy.intercept("POST", "**/product-owner/page*").as("getProductOwner");
    cy.viewport(1280, 720);
    cy.wait("@getProductOwner");

    cy.get('[data-testid="table-row]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Herlyn")
      .parents('[data-testid="table-row]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type("Mayeng");
    cy.get('input[name="user_account_last_name"]').clear().type("Mendoza");
    cy.get('input[name="user_account_emai"]')
      .clear()
      .type("torresherlynmae@gmail.com");

    cy.get('[data-testid="false"]').click();
  });
});
