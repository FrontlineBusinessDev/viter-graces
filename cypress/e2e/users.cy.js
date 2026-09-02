describe("Users Module - CRUD Flow", () => {
  const runId = Date.now();
  const firstName = "Cypress";
  const lastName = `User ${runId}`;
  const email = `cypress.user+${runId}@gmail.com`;
  const updatedLastName = `User ${runId} Updated`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/users");
  });

  // CREATE
  it("Creates a new user account", () => {
    cy.intercept("POST", "**/users").as("createUser");

    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('[data-testid="select-role"]', { timeout: 10000 }).select("Admin");
    cy.get('input[name="user_account_first_name"]').type(firstName);
    cy.get('input[name="user_account_last_name"]').type(lastName);
    cy.get('input[name="user_account_email"]').type(email);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createUser").its("response.statusCode").should("eq", 200);

    cy.contains(lastName, { timeout: 15000 }).should("exist");
  });

  // VALIDATION
  it("Shows a validation error when the email is invalid", () => {
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('input[name="user_account_email"]', { timeout: 10000 })
      .type("not-an-email")
      .blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
    cy.contains(".error-show", "Invalid email").should("exist");
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('input[name="user_account_first_name"]', { timeout: 10000 }).type(
      "Cypress Cancel Test",
    );

    cy.get('[data-testid="false"]').click();

    cy.get('input[name="user_account_first_name"]').should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.get('[data-testid="add-users-btn"]').click();

    cy.get('input[name="user_account_first_name"]', { timeout: 10000 }).type(
      "Cypress Close Test",
    );

    cy.get('[data-testid="close-btn"]').click();

    cy.get('input[name="user_account_first_name"]').should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // UPDATE
  it("Updates a user account", () => {
    cy.intercept("PUT", "**/users/**").as("updateUser");

    cy.contains('[data-testid="table-row"]', lastName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-edit"]:visible').click();
    });

    cy.get('input[name="user_account_last_name"]', { timeout: 10000 })
      .clear()
      .type(updatedLastName);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateUser").its("response.statusCode").should("eq", 200);

    cy.contains(updatedLastName, { timeout: 15000 }).should("exist");
  });

  // SEARCH
  it("Search a user account", () => {
    cy.viewport(390, 844);
    cy.intercept("POST", "**/users/page/*").as("getUsers");

    cy.get('[data-testid="search-input"]').type(`${updatedLastName}{enter}`);

    cy.wait("@getUsers");

    cy.contains(updatedLastName, { timeout: 10000 }).should("exist");
  });

  // ARCHIVE
  it("Archives a user account", () => {
    cy.intercept("PUT", "**/users/**").as("archiveUser");

    cy.contains('[data-testid="table-row"]', updatedLastName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveUser").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restores a user account", () => {
    cy.intercept("PUT", "**/users/**").as("restoreUser");

    cy.contains('[data-testid="table-row"]', updatedLastName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreUser").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Deletes a user account", () => {
    cy.intercept("POST", "**/users/page/*").as("getUsers");
    cy.intercept("PUT", "**/users/**").as("archiveUser");
    cy.intercept("DELETE", "**/users/**").as("deleteUser");

    cy.contains('[data-testid="table-row"]', updatedLastName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveUser");
    // the table refetches (query invalidation) after the archive succeeds -
    // wait for it so the row reflects the archived state before looking
    // for the delete action, which only renders for archived rows
    cy.wait("@getUsers");

    cy.contains('[data-testid="table-row"]', updatedLastName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-delete"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteUser").its("response.statusCode").should("eq", 200);
  });
});
