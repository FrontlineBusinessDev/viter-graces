describe("Role Module - Filter", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/roles");
  });

  //STATUS FILTER
  it("Should filter by active and inactive status", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    //active
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.contains(".react-select__option", /^active$/i).click();

    cy.wait("@getRole");

    //inactive
    cy.get('[data-testid="filter-status-btn"]').click();
    cy.contains(".react-select__option", /^inactive$/i).click();

    cy.wait("@getRole");

    cy.get(".react-select__clear-indicator").click();
  });

  //ROLE NAME FILTER
  it("Should filter role name as the user types", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRole");
    cy.get('[data-testid="role_name"]').type("Admin");

    cy.wait("@getRole");
    cy.contains("Admin", { timeout: 10000 }).should("exist");

    cy.get('[data-testid="role_name"]').clear();
  });

  //ROLE DESCRIPTION FILTER
  it("Should filter role description as the user types", () => {
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.get('[data-testid="role_description"]').type("Developer");

    cy.wait("@getRole");
    cy.contains("Developer", { timeout: 10000 }).should("exist");

    cy.get('[data-testid="role_description"]').click();
  });

  //SEARCH - MOBILE
  it("Search role - Mobile", () => {
    cy.viewport(390, 844);
    cy.intercept("POST", "**/roles/page/*").as("getRole");

    cy.get('[data-testid="search-input"]').type("Admin{enter}");

    cy.wait("@getRole");

    cy.contains("Admin", { timeout: 1000 }).should("exist");
  });
});
