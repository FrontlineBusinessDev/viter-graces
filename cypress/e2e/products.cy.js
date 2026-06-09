describe("Products Module - CRUD Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.visit("/portal/login");

      cy.get("input[name=user_account_email]").type(Cypress.env("email"));

      cy.get("input[name=password]").type(Cypress.env("password"));

      cy.get("button[type=submit]").click();

      cy.url().should("not.include", "/login");
    });

    cy.visit("/portal/developer/products");
  });

  // CREATE
  it("Create product", () => {
    cy.get('[data-testid="add-product-btn"]').click();

    cy.get('input[name="products_name"]', { timeout: 10000 })
      .should("be.visible")
      .type("Cypress Product");

    cy.get('input[name="products_price"]').type("100");
    cy.get('input[name="products_cost"]').type("50");
    cy.get('input[name="products_low_stock_threshold"]').type("5");
    cy.get('input[name="products_category"]').type("Test food");
    cy.get('input[name="products_stocks"]').type("30");
    cy.get('textarea[name="products_description"]').type(
      "This is test product",
    );

    // CUSTOM Supplier dropdown
    cy.get('[data-testid="select-supplier"]').select("Supplier 2");

    // CUSTOM Product Owner dropdown
    cy.get('[data-testid="select-product-owner"]').select("Isobel Rubico");

    cy.intercept("POST", "**/products").as("createProduct");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createProduct");

    cy.contains("Cypress Product", { timeout: 15000 }).should("exist");
  });

  // UPDATE
  it("Update product", () => {
    cy.contains("Cypress Product")
      .closest('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('input[name="products_name"]', { timeout: 10000 })
      .should("be.visible")
      .type("Cypress Product");

    cy.get('input[name="products_price"]').type("200");
    cy.get('input[name="products_cost"]').type("90");
    cy.get('input[name="products_low_stock_threshold"]').type("9");
    cy.get('input[name="products_category"]').type("Test foodss");
    cy.get('input[name="products_stocks"]').type("10");
    cy.get('textarea[name="products_description"]').type(
      "This is test product Updated",
    );

    // CUSTOM Supplier dropdown
    cy.get('[data-testid="select-supplier"]').select("Supplier 2");

    // CUSTOM Product Owner dropdown
    cy.get('[data-testid="select-product-owner"]').select("Isobel Rubico");

    cy.intercept("PUT", "**/products").as("createProduct");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createProduct");

    cy.contains("Cypress Product", { timeout: 15000 }).should("exist");
  });

  // ARCHIVE
  it("Archive product", () => {
    cy.contains("Cypress Product")
      .parents("tr")
      .within(() => {
        cy.get('[data-action="archieve"]').click();
      });

    cy.contains("Archived successfully").should("exist");
  });

  // RESTORE
  it("Restore product", () => {
    cy.contains("Archived").click();

    cy.contains("Cypress Product")
      .parent()
      .within(() => {
        cy.contains("Restore").click();
      });

    cy.contains("Restored successfully").should("exist");
  });

  // DELETE
  it("Delete product", () => {
    cy.contains("Cypress Product")
      .parent()
      .within(() => {
        cy.contains("Delete").click();
      });

    cy.contains("Confirm").click();

    cy.contains("Deleted successfully").should("exist");
  });
});
