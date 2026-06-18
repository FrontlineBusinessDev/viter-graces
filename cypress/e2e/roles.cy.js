describe("Roles Module - CRUD Flow", () => {
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

  //UPDATE
  it("Update role", () => {
    //cancel button
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.viewport(1280, 720);
    cy.wait("@getRole");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Test Role")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('textarea[name="role_description"]')
      .should("be.visible")
      .clear()
      .type("The test role is updated");

    cy.get('[data-testid="false"]').click();

    //save button
    cy.intercept("POST", "**/roles/page/*").as("getRole");
    cy.intercept("PUT", "**/roles/**").as("updateRole");

    cy.viewport(1280, 720);
    cy.wait("@getRole");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Test Role")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('textarea[name="role_description"]')
      .should("be.visible")
      .clear()
      .type("The test role is updated");

    cy.get('[data-testid="save-product-btn"]').click();
    cy.wait("@updateRole");

    //close button
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.viewport(1280, 720);
    cy.wait("@getRole");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Test Role")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('textarea[name="role_description"]')
      .should("be.visible")
      .clear()
      .type("The test role is updated");

    cy.get('[data-testid="close-btn"]').click();
  });

  //ARCHIVE
  it("Archive role", () => {
    //cancel
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.wait("@getRole");

    cy.contains('[data-testid="table-row"]', "Test Role", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Cancel").click();

    //confirm
    cy.intercept("POST", "**/roles/page/*").as("getRole");
    cy.intercept("PUT", "**/roles/**").as("archiveRole");

    cy.wait("@getRole");

    cy.contains('[data-testid="table-row"]', "Test Role", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveRole").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  //RESTORE
  it("Restore role", () => {
    //cancel
    cy.viewport(1280, 720);
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.wait("@getRole");

    cy.contains('[data-testid="table-row"]', "Test Role", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Cancel").click();

    //confirm
    cy.viewport(1280, 720);
    cy.intercept("POST", "**/roles/page/*").as("getRoles");
    cy.intercept("PUT", "**/roles/**").as("restoreRole");

    cy.wait("@getRole");

    cy.contains('[data-testid="table-row"]', "Test Role", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreRole").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  //DELETE
  it("Delete role", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRole");
    cy.intercept("PUT", "**/roles/**").as("archiveRole");
    cy.intercept("DELETE", "**/roles/**").as("deleteRole");

    cy.wait("@getRole");

    cy.contains('[data-testid="table-row"]', "Test Role", { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveRole");

    cy.contains('[data-testid="table-row"]', "Test Role").within(() => {
      cy.get('[data-testid="action-delete"]').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteRole").its("response.statusCode").should("equal", 200);
  });
});
