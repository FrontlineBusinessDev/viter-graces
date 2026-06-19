describe("Customers Module - CRUD Flow ", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/customers");
  });

  //   CREATE
  it("Create customers", () => {
    cy.get('[data-testid="add-customer-btn"]').click();

    cy.get('input[name="customer_name"]').type("Customer Name");
    cy.get('input[name="customer_email"]').type("customer@gmail.com");
    cy.get('input[name="customer_phone"]').type("0909090090");
    cy.get('input[name="customer_address"]').type("Customer Address");
    cy.get('input[name="customer_messenger"]').type("messenger.com");
    cy.get('input[name="customer_whatsapp"]').type("whatsapp.com");
    cy.get('input[name="customer_other"]').type("others.com");
    cy.get('textarea[name="customer_notes"]').type(
      "This is the customer notes",
    );

    cy.intercept("POST", "**/customer").as("createCustomer");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createCustomer");

    cy.contains("Customer Name", { timeout: 15000 }).should("exist");
  });

  //   CLICK THE CUSTOMER NAME
  it("Click the Customer name to open the table below", () => {
    cy.contains('[data-testid="table-row"]', "Customer Name")
      .find('[data-testid="button-open-customer-tab"]:visible')
      .click();
  });

  //SEARCH
  it("Search a product", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="search-input"]').type("Customer Name{enter}");

    cy.wait("@getCustomer");

    cy.contains("Customer Name", { timeout: 1000 }).should("exist");
  });

  //   UPDATE
  it("Update customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("updateCustomer");

    cy.get('[data-testid="table-row"]', { timeout: 2000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.contains('[data-testid="table-row"]', "Customer Name")
      .find('[data-testid="action-edit"]:visible')
      .click();

    cy.get('input[name="customer_name"]')
      .should("be.visible")
      .clear()
      .type("Customer Name Updated");
    cy.get('input[name="customer_email"]')
      .clear()
      .type("customerupdated@gmail.com");
    cy.get('input[name="customer_phone"]').clear().type("0912121212121");
    cy.get('input[name="customer_address"]')
      .clear()
      .type("Customer Address Updated");
    cy.get('input[name="customer_messenger"]')
      .clear()
      .type("messengerUpdated.com");
    cy.get('input[name="customer_whatsapp"]')
      .clear()
      .type("whatsappUpdated.com");
    cy.get('input[name="customer_other"]').clear().type("othersUpdated.com");
    cy.get('textarea[name="customer_notes"]')
      .clear()
      .type("This is the customer notes updated");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateCustomer");

    cy.contains("Customer Name Updated").should("exist");
  });

  // ARCHIVE
  it("Archive Customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("archiveCustomer");

    cy.contains('[data-testid="table-row"]', "Customer Name Updated")
      .find('[data-testid="action-archive"]:visible')
      .click();

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveCustomer").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore Customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("restoreCustomer");

    cy.contains('[data-testid="table-row"]', "Customer Name Updated")
      .find('[data-testid="action-restore"]:visible')
      .click();

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreCustomer").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Delete Customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("archiveCustomer");
    cy.intercept("DELETE", "**/customer/**").as("deleteCustomer");

    cy.wait("@getCustomer");

    cy.contains('[data-testid="table-row"]', "Customer Name Updated")
      .find('[data-testid="action-archive"]:visible')
      .click();

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveCustomer");

    cy.contains('[data-testid="table-row"]', "Customer Name Updated")
      .find('[data-testid="action-delete"]:visible')
      .click();

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteCustomer").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast-message"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });
});
