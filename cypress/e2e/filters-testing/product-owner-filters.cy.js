describe("Product Owner Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/product-owner");
  });

  // STATUS
  it("Should filter by active and inactive status", () => {
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");

    // active
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "Active")
      .click();

    cy.wait("@getProductOwner");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    // inactive
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.get('[data-testid="filter-status-btn"]')
      .contains(".react-select__option", "Inactive")
      .click();

    cy.wait("@getProductOwner");

    cy.get(
      '[data-testid="filter-status-btn"] .react-select__clear-indicator',
    ).click();
  });

  // NAME
  it("Should filter the name as the user types", () => {
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");

    cy.get('[data-testid="name"]').type("Herlyn");

    cy.wait("@getProductOwner");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains('[data-testid="table-row"]', "Herlyn").should("exist");

    cy.get('[data-testid="name"]').clear();
  });

  // EMAIL
  it("Should filter the email as the user types", () => {
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");

    cy.get('[data-testid="user_account_email"]').type("gmail.com");

    cy.wait("@getProductOwner");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
    cy.contains('[data-testid="table-row"]', "gmail.com").should("exist");

    cy.get('[data-testid="user_account_email"]').clear();
  });

  // SEARCH - MOBILE
  it("Search product owner - Mobile", () => {
    cy.viewport(390, 844);

    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");

    cy.get('[data-testid="search-input"]').type("Lumabas{enter}");

    cy.wait("@getProductOwner");

    cy.contains("Lumabas", { timeout: 1000 }).should("exist");
  });

  // CLEAR ALL FILTERS
  it("Clears all filters and returns to the unfiltered list", () => {
    cy.intercept("POST", "**/product-owner/page/*").as("getProductOwner");

    cy.wait("@getProductOwner");
    cy.get('[data-testid="table-row"]', { timeout: 20000 }).should(
      "have.length.greaterThan",
      0,
    );

    cy.get("@getProductOwner.all").then((interceptions) => {
      const baselineCount = interceptions.length;

      cy.get('[data-testid="name"]').type("a");
      cy.wait("@getProductOwner");

      cy.get('[data-testid="user_account_email"]').type("com");
      cy.wait("@getProductOwner");

      cy.get('[data-testid="table-row"]').should(
        "have.length.greaterThan",
        0,
      );

      cy.get('[data-testid="name"]').clear();
      cy.get('[data-testid="user_account_email"]').clear();

      cy.get("@getProductOwner.all").should(
        "have.length.greaterThan",
        baselineCount,
      );

      cy.get('[data-testid="table-row"]').should(
        "have.length.greaterThan",
        0,
      );
    });
  });
});
