describe("Product Owner - CRUD and Search Flow", () => {
  // unique per run so re-running the suite never creates a duplicate
  // product owner name/email and breaks row lookups further down
  const runId = Date.now();
  const firstName = `Herlyn${runId}`;
  const lastName = "Torres";
  const email = `herlyn.torres+${runId}@frontlinebusiness.com.ph`;

  const updatedFirstName = `Mayeng${runId}`;
  const updatedLastName = "Mendoza";
  const updatedEmail = `torresherlynmae+${runId}@gmail.com`;

  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });

    cy.visit("developer/product-owner");
  });

  // CREATE
  it("Creates a new product owner", () => {
    //cancel
    cy.get('[data-testid="add-product-owner-btn"]').click();

    cy.get('input[name="user_account_first_name"]').type(firstName);
    cy.get('input[name="user_account_last_name"]').type(lastName);
    cy.get('input[name="user_account_email"]').type(email);

    cy.get('[data-testid="false"]').click();

    //close
    cy.get('[data-testid="add-product-owner-btn"]').click();

    cy.get('input[name="user_account_first_name"]').type(firstName);
    cy.get('input[name="user_account_last_name"]').type(lastName);
    cy.get('input[name="user_account_email"]').type(email);

    cy.get('[data-testid="close-btn"]').click();

    //save
    cy.get('[data-testid="add-product-owner-btn"]').click();

    cy.get('input[name="user_account_first_name"]').type(firstName);
    cy.get('input[name="user_account_last_name"]').type(lastName);
    cy.get('input[name="user_account_email"]').type(email);

    cy.intercept("POST", "**/product-owner").as("createProductOwner");

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@createProductOwner");

    cy.contains(firstName, { timeout: 1000 }).should("exist");
  });

  // UPDATE
  it("Update product owner", () => {
    //cancel btn
    cy.intercept("POST", "**/product-owner/page*").as("getProductOwner");

    cy.viewport(1280, 720);

    cy.get('[data-testid="table-row"]', { timeout: 10000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains(firstName)
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type(updatedFirstName);

    cy.get('input[name="user_account_last_name"]')
      .clear()
      .type(updatedLastName);

    cy.get('input[name="user_account_email"]').clear().type(updatedEmail);

    cy.get('[data-testid="false"]').click();

    // save btn
    cy.intercept("POST", "**/product-owner/page*").as("getProductOwner");
    cy.intercept("PUT", "**/product-owner/**").as("updateProductOwner");

    cy.viewport(1280, 720); //size
    // cy.wait("@getProductOwner");

    cy.get('[data-testid="table-row"]', { timeout: 1000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains(firstName)
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type(updatedFirstName);
    cy.get('input[name="user_account_last_name"]')
      .clear()
      .type(updatedLastName);
    cy.get('input[name="user_account_email"]').clear().type(updatedEmail);

    cy.get('[data-testid="save-product-btn"]').click();

    cy.wait("@updateProductOwner");

    //close btn
    cy.intercept("POST", "**/product-owner/page*").as("getProductOwner");

    cy.viewport(1280, 720);

    cy.get('[data-testid="table-row"]', { timeout: 10000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get('[data-testid="table-row"]')
      .contains(updatedFirstName)
      .parents('[data-testid="table-row"]')
      .within(() => {
        cy.get('[data-testid="action-edit"]').click();
      });

    cy.get('input[name="user_account_first_name"]')
      .should("be.visible")
      .clear()
      .type(firstName);

    cy.get('input[name="user_account_last_name"]').clear().type(lastName);

    cy.get('input[name="user_account_email"]').clear().type(email);

    cy.get('[data-testid="close-btn"]').click();
  });

  // ARCHIVE
  it("Archive product owner", () => {
    //cancel btn
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");
    cy.wait("@getProductOwner");

    cy.contains('[data-testid="table-row"]', updatedFirstName, {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Cancel").click();

    //confirm
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");
    cy.intercept("PUT", "**/product-owner/**").as("archiveProductOwner");
    cy.wait("@getProductOwner");

    cy.contains('[data-testid="table-row"]', updatedFirstName, {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveProductOwner")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  // RESTORE
  it("Restore product owner", () => {
    //cancel btn
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");
    cy.wait("@getProductOwner");

    cy.contains('[data-testid="table-row"]', updatedFirstName, {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Cancel").click();

    //confirm
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");
    cy.intercept("PUT", "**/product-owner/**").as("restoreProductOwner");
    cy.wait("@getProductOwner");

    cy.contains('[data-testid="table-row"]', updatedFirstName, {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-restore"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@restoreProductOwner")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get('[data-testid="toast"]')
      .should("be.visible")
      .and("contain.text", "successfully");
  });

  //SEARCH
  it("Search a user account ", () => {
    // the top search bar is only rendered for small screens on filter-enabled
    // tables (haveFilterTable) - desktop uses per-column filters instead
    cy.viewport(390, 844);

    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");

    cy.get('[data-testid="search-input"]').type(`${updatedFirstName}{enter}`);

    cy.wait("@getProductOwner");

    cy.contains(updatedFirstName, { timeout: 1000 }).should("exist");
  });

  // DELETE
  it("Delete product owner", () => {
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");
    cy.intercept("PUT", "**/product-owner/**").as("archiveProductOwner");
    cy.intercept("DELETE", "**/product-owner/**").as("deleteProductOwner");

    cy.wait("@getProductOwner");

    cy.contains('[data-testid="table-row"]', updatedFirstName, {
      timeout: 1000,
    })
      .should("be.visible")
      .within(() => {
        cy.get('[data-testid="action-archive"]').click();
      });

    cy.contains("button", "Confirm").click();

    cy.wait("@archiveProductOwner");
    // the table refetches (query invalidation) after the archive succeeds -
    // wait for it so the row reflects the archived state before looking
    // for the delete action, which only renders for archived rows
    cy.wait("@getProductOwner");

    cy.contains('[data-testid="table-row"]', updatedFirstName).within(() => {
      cy.get('[data-testid="action-delete"]').click();
    });

    cy.contains("button", "Confirm").click();

    cy.wait("@deleteProductOwner")
      .its("response.statusCode")
      .should("equal", 200);
  });
});
