describe("Suppliers Module - CRUD Flow", () => {
  const runId = Date.now();
  const supplierName = `Cypress Supplier ${runId}`;
  const updatedSupplierName = `Cypress Supplier ${runId} Updated`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/suppliers");
  });

  // CREATE
  it("Create a supplier", () => {
    cy.intercept("POST", "**/suppliers").as("createSupplier");

    cy.contains("button", /suppliers/i).click();

    cy.get('[data-testid="suppliers_name"]', { timeout: 10000 }).type(
      supplierName,
    );

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createSupplier").its("response.statusCode").should("eq", 200);

    cy.contains(supplierName, { timeout: 15000 }).should("exist");
  });

  // VALIDATION
  it("Shows a validation error when name is left empty", () => {
    cy.contains("button", /suppliers/i).click();

    cy.get('[data-testid="suppliers_name"]', { timeout: 10000 })
      .type("a")
      .clear()
      .blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
    cy.contains(".error-show", "Required").should("exist");
  });

  // CANCEL
  it("Cancel button closes the modal without saving", () => {
    cy.contains("button", /suppliers/i).click();

    cy.get('[data-testid="suppliers_name"]', { timeout: 10000 }).type(
      "Cypress Cancel Test",
    );

    cy.get('[data-testid="false"]').click();

    cy.get('[data-testid="suppliers_name"]').should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes the modal without saving", () => {
    cy.contains("button", /suppliers/i).click();

    cy.get('[data-testid="suppliers_name"]', { timeout: 10000 }).type(
      "Cypress Close Test",
    );

    cy.get('[data-testid="close-btn"]').click();

    cy.get('[data-testid="suppliers_name"]').should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  // UPDATE
  it("Update a supplier", () => {
    cy.intercept("PUT", "**/suppliers/**").as("updateSupplier");

    cy.contains('[data-testid="table-row"]', supplierName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-edit"]:visible').click();
    });

    cy.get('[data-testid="suppliers_name"]', { timeout: 10000 })
      .clear()
      .type(updatedSupplierName);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateSupplier").its("response.statusCode").should("eq", 200);

    cy.contains(updatedSupplierName, { timeout: 15000 }).should("exist");
  });

  // ARCHIVE
  it("Archive a supplier", () => {
    cy.intercept("PUT", "**/suppliers/**").as("archiveSupplier");

    cy.contains('[data-testid="table-row"]', updatedSupplierName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveSupplier").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore a supplier", () => {
    cy.intercept("PUT", "**/suppliers/**").as("restoreSupplier");

    cy.contains('[data-testid="table-row"]', updatedSupplierName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-restore"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreSupplier").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Delete a supplier", () => {
    cy.intercept("POST", "**/suppliers/page/*").as("getSuppliers");
    cy.intercept("PUT", "**/suppliers/**").as("archiveSupplier");
    cy.intercept("DELETE", "**/suppliers/**").as("deleteSupplier");

    cy.contains('[data-testid="table-row"]', updatedSupplierName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-archive"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveSupplier");
    // the table refetches (query invalidation) after the archive succeeds -
    // wait for it so the row reflects the archived state before looking
    // for the delete action, which only renders for archived rows
    cy.wait("@getSuppliers");

    cy.contains('[data-testid="table-row"]', updatedSupplierName, {
      timeout: 15000,
    }).within(() => {
      cy.get('[data-testid="action-delete"]:visible').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteSupplier").its("response.statusCode").should("eq", 200);
  });
});
