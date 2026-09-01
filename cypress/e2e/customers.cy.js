describe("Customers Module - CRUD Flow ", () => {
  // unique per run so re-running the suite never creates a duplicate
  // customer name and breaks row lookups further down
  const runId = Date.now();
  const customerName = `Customer${runId}`;
  const updatedCustomerName = `Customer${runId} Updated`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/customers");
  });

  //   CREATE
  it("Create customers", () => {
    cy.get('[data-testid="add-product-btn"]').click();

    cy.get('input[name="customer_name"]').type(customerName);
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

    cy.contains(customerName, { timeout: 15000 }).should("exist");
  });

  // VALIDATION
  it("Shows validation errors when required fields are empty", () => {
    cy.get('[data-testid="add-product-btn"]').click();

    cy.get('input[name="customer_name"]', { timeout: 10000 }).should(
      "be.visible",
    );

    // touch and clear the required field to trigger Formik validation
    cy.get('input[name="customer_name"]').type("a").clear().blur();

    cy.get(".error-show").should("have.length.greaterThan", 0);
    cy.contains(".error-show", "Required").should("exist");

    // save button should still be present - i.e. nothing was submitted
    cy.get('input[name="customer_name"]').should("exist");
  });

  // CANCEL
  it("Cancel button closes Add modal without saving", () => {
    cy.get('[data-testid="add-product-btn"]').click();

    cy.get('input[name="customer_name"]', { timeout: 10000 })
      .should("be.visible")
      .type("Cypress Cancel Test");

    cy.get('[data-testid="false"]').click();

    cy.get('input[name="customer_name"]').should("not.exist");
    cy.contains("Cypress Cancel Test").should("not.exist");
  });

  // CLOSE
  it("Close (X) button closes Add modal without saving", () => {
    cy.get('[data-testid="add-product-btn"]').click();

    cy.get('input[name="customer_name"]', { timeout: 10000 })
      .should("be.visible")
      .type("Cypress Close Test");

    cy.get('[data-testid="close-btn"]').click();

    cy.get('input[name="customer_name"]').should("not.exist");
    cy.contains("Cypress Close Test").should("not.exist");
  });

  //   CLICK THE CUSTOMER NAME
  it("Click the customer name navigates to Sales Orders", () => {
    cy.contains('[data-testid="table-row"]', customerName)
      .contains("a", customerName)
      .click();

    cy.url().should("include", "/sales-orders");
  });

  //SEARCH
  it("Search a customer", () => {
    // the top search bar is only rendered for small screens on filter-enabled
    // tables (haveFilterTable) - desktop uses per-column filters instead
    cy.viewport(390, 844);

    cy.intercept("POST", "**/customer/page/*").as("getCustomer");

    cy.get('[data-testid="search-input"]').type(`${customerName}{enter}`);

    cy.wait("@getCustomer");

    cy.contains(customerName, { timeout: 1000 }).should("exist");
  });

  //   UPDATE
  it("Update customer", () => {
    cy.viewport(1280, 720);

    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("updateCustomer");

    cy.get('[data-testid="table-row"]', { timeout: 2000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.contains('[data-testid="table-row"]', customerName).within(() => {
      cy.get('[data-testid="action-edit"]').click();
    });

    cy.get('input[name="customer_name"]')
      .should("be.visible")
      .clear()
      .type(updatedCustomerName);
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

    cy.contains(updatedCustomerName).should("exist");
  });

  // ARCHIVE
  it("Archive Customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("archiveCustomer");

    cy.contains('[data-testid="table-row"]', updatedCustomerName).within(
      () => {
        cy.get('[data-testid="action-archive"]').click();
      },
    );

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveCustomer").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore Customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("restoreCustomer");

    cy.contains('[data-testid="table-row"]', updatedCustomerName).within(
      () => {
        cy.get('[data-testid="action-restore"]').click();
      },
    );

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreCustomer").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // DELETE
  it("Delete Customer", () => {
    cy.intercept("POST", "**/customer/page/*").as("getCustomer");
    cy.intercept("PUT", "**/customer/**").as("archiveCustomer");
    cy.intercept("DELETE", "**/customer/**").as("deleteCustomer");

    cy.wait("@getCustomer");

    cy.contains('[data-testid="table-row"]', updatedCustomerName).within(
      () => {
        cy.get('[data-testid="action-archive"]').click();
      },
    );

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveCustomer");
    // the table refetches (query invalidation) after the archive succeeds -
    // wait for it so the row reflects the archived state before looking
    // for the delete action, which only renders for archived rows
    cy.wait("@getCustomer");

    cy.contains('[data-testid="table-row"]', updatedCustomerName).within(
      () => {
        cy.get('[data-testid="action-delete"]').click();
      },
    );

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteCustomer").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });
});
