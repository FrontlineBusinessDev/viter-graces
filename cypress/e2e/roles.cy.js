describe("Roles Module - CRUD Flow", () => {
  const runId = Date.now();
  const roleName = `Cypress Role ${runId}`;
  const roleDescription = `Created via Cypress ${runId}`;
  const updatedDescription = `Updated via Cypress ${runId}`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/roles");
  });

  // CREATE
  it("Create role", () => {
    cy.intercept("POST", "**/roles").as("createRole");

    cy.get('[data-testid="add-roles-btn"]').click();

    cy.get('input[name="role_name"]', { timeout: 10000 }).type(roleName);
    cy.get('textarea[name="role_description"]').type(roleDescription);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createRole").its("response.statusCode").should("eq", 200);

    cy.contains(roleName, { timeout: 15000 }).should("exist");
  });

  // VALIDATION
  it("Shows a validation error when the role name is left empty", () => {
    cy.get('[data-testid="add-roles-btn"]').click();

    cy.get('input[name="role_name"]', { timeout: 10000 })
      .type("a")
      .clear()
      .blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
    cy.contains(".error-show", "Required").should("exist");
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.get('[data-testid="add-roles-btn"]').click();

    cy.get('input[name="role_name"]', { timeout: 10000 }).type(
      "Cypress Cancel Test",
    );

    cy.get('[data-testid="false"]').click();

    cy.get('input[name="role_name"]').should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.get('[data-testid="add-roles-btn"]').click();

    cy.get('input[name="role_name"]', { timeout: 10000 }).type(
      "Cypress Close Test",
    );

    cy.get('[data-testid="close-btn"]').click();

    cy.get('input[name="role_name"]').should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // UPDATE
  it("Update role", () => {
    // the role name is read-only once created (only the description is
    // editable via the edit modal), so this only exercises the description
    cy.intercept("PUT", "**/roles/**").as("updateRole");

    cy.contains('[data-testid="table-row"]', roleName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-edit"]:visible').click();
    });

    cy.get('textarea[name="role_description"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(updatedDescription);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateRole").its("response.statusCode").should("eq", 200);

    cy.contains(updatedDescription, { timeout: 15000 }).should("exist");
  });

  // ARCHIVE
  it("Archive role", () => {
    cy.intercept("PUT", "**/roles/**").as("archiveRole");

    cy.contains('[data-testid="table-row"]', roleName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveRole").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore role", () => {
    cy.intercept("PUT", "**/roles/**").as("restoreRole");

    cy.contains('[data-testid="table-row"]', roleName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreRole").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Delete role", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRoles");
    cy.intercept("PUT", "**/roles/**").as("archiveRole");
    cy.intercept("DELETE", "**/roles/**").as("deleteRole");

    cy.contains('[data-testid="table-row"]', roleName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveRole");
    // the table refetches (query invalidation) after the archive succeeds -
    // wait for it so the row reflects the archived state before looking
    // for the delete action, which only renders for archived rows
    cy.wait("@getRoles");

    cy.contains('[data-testid="table-row"]', roleName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-delete"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteRole").its("response.statusCode").should("eq", 200);
  });
});
