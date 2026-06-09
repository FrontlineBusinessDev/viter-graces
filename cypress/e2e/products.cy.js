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

    // CUSTOM Product Owner dropdown
    cy.contains("Product Owner").click();
    cy.get('[data-testid="select-product-owner"]').select("Cyzai Lumabas");
    // cy.contains("").click();

    // OR replace "option" with actual name like:
    // cy.contains("John Doe").click();

    cy.intercept("POST", "**/products").as("createProduct");

    cy.get('[data-testid="save-product-btn"]').click();

    // cy.intercept("GET", "**/products/page/1**").as("getProducts");

    cy.wait("@createProduct");
    // cy.wait("@getProducts");

    cy.contains("Cypress Product", { timeout: 15000 }).should("exist");
  });

  it("Archive product", () => {
    cy.contains("Cypress Product")
      .parents("tr")
      .within(() => {
        cy.get('[data-action="archieve"]').click();
      });

    cy.contains("Archived successfully").should("exist");
  });

  it("Restore product", () => {
    cy.contains("Archived").click();

    cy.contains("Cypress Product")
      .parent()
      .within(() => {
        cy.contains("Restore").click();
      });

    cy.contains("Restored successfully").should("exist");
  });

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
