describe("Users Module - CRUD and Search Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });

    cy.visit("/developer/users");
  });

  //CREATE
  it("Creates a new user account", () => {
    //cancel btn
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]').select(1);
    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Mae");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.get('[data-testid="false"]').click();

    //close btn
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]').select(1);
    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Mae");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );
    cy.get('[data-testid="close-btn"]').click();

    //save btn
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]').select(2);
    cy.get('input[name="user_account_first_name"]').type("Herlyn");
    cy.get('input[name="user_account_last_name"]').type("Mae");
    cy.get('input[name="user_account_email"]').type(
      "herlyn.torres@frontlinebusiness.com.ph",
    );

    cy.intercept("POST", "**/users").as("createUser");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createUser");

    cy.contains("Herlyn", { timeout: 1000 }).should("exist");
  });

  //UPDATE
  it("Updates a user account", () => {
    //cancel btn
    cy.intercept("POST", "**/users/page/*").as("getUser");

    cy.viewport(1280, 720); //size
    cy.wait("@getUser");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Herlyn")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('[data-testid="select-role"]').select(4);
    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type("Mayeng");
    cy.get('input[name="user_account_last_name"]').clear().type("Torres");
    cy.get('input[name="user_account_email"]')
      .clear()
      .type("torresherlynmae@gmail.com");

    cy.get('[data-testid="false"]').click();

    //save btn
    cy.intercept("POST", "**/users/page/*").as("getUser");
    cy.intercept("PUT", "**/users/**").as("updateUser");

    cy.viewport(1280, 720); //size
    cy.wait("@getUser");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Herlyn")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('[data-testid="select-role"]').select(4);
    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type("Mayeng");
    cy.get('input[name="user_account_last_name"]').clear().type("Torres");
    cy.get('input[name="user_account_email"]')
      .clear()
      .type("torresherlynmae@gmail.com");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateUser");

    //close btn
    cy.intercept("POST", "**/users/page/*").as("getUser");

    cy.viewport(1280, 720); //size
    cy.wait("@getUser");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Mayeng")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('[data-testid="select-role"]').select(4);
    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type("Herlyn");
    cy.get('input[name="user_account_last_name"]').clear().type("Torres");
    cy.get('input[name="user_account_email"]')
      .clear()
      .type("torresherlynmae@gmail.com");

    cy.get('[data-testid="close-btn"]').click();
  });

  //ARCHIVE
  it("Archives a user account", () => {
    //cancel
    cy.intercept("POST", "**/users/page/*").as("getUser");

    cy.wait("@getUser");

    cy.contains('[data-testid="table-row"]', "Mayeng", {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Cancel").click();

    //confirm
    cy.intercept("POST", "**/users/page/*").as("getUser");
    cy.intercept("PUT", "**/users/**").as("archiveUser");

    cy.wait("@getUser");

    cy.contains('[data-testid="table-row"]', "Mayeng", {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveUser").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  //RESTORE
  it("Restores a user account", () => {
    //cancel
    cy.viewport(1280, 720);

    cy.intercept("POST", "**/users/page/*").as("getUser");

    cy.wait("@getUser");

    cy.contains('[data-testid="table-row"]', "Mayeng", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Cancel").click();

    //confirm
    cy.viewport(1280, 720);

    cy.intercept("POST", "**/users/page/*").as("getUser");
    cy.intercept("PUT", "**/users/**").as("restoreUser");

    cy.wait("@getUser");

    cy.contains('[data-testid="table-row"]', "Mayeng", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreUser").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  //SEARCH
  it("Search a user account ", () => {
    cy.intercept("POST", "**/users/page/*").as("getUser");

    cy.get('[data-testid="search-input"]').type("Lumabas");

    cy.wait("@getUser");

    cy.contains("Lumabas", { timeout: 1000 }).should("exist");
  });

  // DELETE
  it("Deletes a user account", () => {
    cy.intercept("POST", "**/users/page/*").as("getUser");
    cy.intercept("PUT", "**/users/**").as("archiveUser");
    cy.intercept("DELETE", "**/users/**").as("deleteUser");

    cy.wait("@getUser");

    cy.contains('[data-testid="table-row"]', "Mayeng", {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveUser");

    cy.contains('[data-testid="table-row"]', "Mayeng").within(() => {
      cy.get('[data-testid="action-delete"]').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteUser").its("response.statusCode").should("equal", 200);
  });
});
