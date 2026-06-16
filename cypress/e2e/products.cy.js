describe("Products Module - CRUD Flow", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });

    cy.visit("/developer/products");
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
    cy.get('[data-testid="select-supplier"]').select(1);

    // CUSTOM Product Owner dropdown
    cy.get('[data-testid="select-product-owner"]').select(1);

    cy.intercept("POST", "**/products").as("createProduct");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createProduct");

    cy.contains("Cypress Product", { timeout: 15000 }).should("exist");
  });

  // UPDATE
  it("Update product", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.intercept("PUT", "**/products/**").as("updateProduct");

    cy.viewport(1280, 720);

    cy.wait("@getProducts");

    cy.get('[data-testid="table-row"]', { timeout: 20000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains("Cypress Product")
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('input[name="products_name"]')
      .should("be.visible")
      .clear()
      .type("Cypress Product Updated");

    cy.get('input[name="products_price"]').clear().type("300");
    cy.get('input[name="products_cost"]').clear().type("90");
    cy.get('input[name="products_low_stock_threshold"]').clear().type("9");
    cy.get('input[name="products_category"]').clear().type("Test foodss");
    cy.get('textarea[name="products_description"]')
      .clear()
      .type("This is test product Updated");

    cy.get('[data-testid="select-supplier"]').select(2);
    cy.get('[data-testid="select-product-owner"]').select(2);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateProduct");

    cy.contains("Cypress Product Updated", { timeout: 15000 }).should("exist");
  });

  // ARCHIVE
  it("Archive product", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.intercept("PUT", "**/products/**").as("archiveProduct");

    cy.wait("@getProducts");

    cy.contains('[data-testid="table-row"]', "Cypress Product", {
      timeout: 20000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveProduct").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore product", () => {
    cy.viewport(1280, 720);

    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.intercept("PUT", "**/products/**").as("restoreProduct");

    cy.wait("@getProducts");

    cy.contains('[data-testid="table-row"]', "Cypress Product", {
      timeout: 20000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreProduct").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Delete product", () => {
    cy.intercept("POST", "**/products/page/*").as("getProducts");
    cy.intercept("PUT", "**/products/**").as("archiveProduct");
    cy.intercept("DELETE", "**/products/**").as("deleteProduct");

    cy.wait("@getProducts");

    cy.contains('[data-testid="table-row"]', "Cypress Product").within(() => {
      cy.get('[data-testid="action-archive"]').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveProduct");

    cy.contains('[data-testid="table-row"]', "Cypress Product").within(() => {
      cy.get('[data-testid="action-delete"]').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteProduct").its("response.statusCode").should("eq", 200);
  });
});
