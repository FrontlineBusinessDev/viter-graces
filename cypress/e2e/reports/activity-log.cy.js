describe("Reports - Activity Log", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/activity-log");
  });

  it("Loads the activity log report", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    // the log accumulates on every write action (logins, CRUD, etc.) so
    // it should never legitimately be empty
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);
  });

  it("Does not render an add button", () => {
    cy.contains("button", /activity log/i).should("not.exist");
  });

  // MENU
  it("Should filter the menu as the user types", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="activity_log_menu"]').type("user");

    cy.wait("@getReport").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="activity_log_menu"]').clear();
  });

  // ACTION
  it("Should filter the action as the user types", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="activity_log_action"]').type("update");

    cy.wait("@getReport").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="activity_log_action"]').clear();
  });

  // USER
  it("Should filter the user as the user types", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="activity_log_user_name"]').type("cy");

    cy.wait("@getReport").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="activity_log_user_name"]').clear();
  });

  // ROLE
  it("Should filter the role as the user types", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="activity_log_user_role"]').type("admin");

    cy.wait("@getReport").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="activity_log_user_role"]').clear();
  });

  // DATE
  it("Should filter by date", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.get('[data-testid="activity_log_created"]').type("2026-08-14");

    // whether any entry was logged on this specific date depends on the
    // dataset - just assert the filter request completes
    cy.wait("@getReport").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="activity_log_created"]').clear();
  });

  // VIEW DETAILS
  it("Should open and close the activity log details modal", () => {
    cy.intercept("POST", "**/activity-log/page-all-activity-log/page/*").as(
      "getReport",
    );

    cy.wait("@getReport");

    cy.get('[data-testid="table-row"]')
      .first()
      .find('[data-testid="action-view-details"]')
      .click();

    cy.get('[data-testid="activity-log-details-backdrop"]').should(
      "be.visible",
    );
    cy.contains("Activity Log Details").should("be.visible");

    cy.get('[data-testid="close-btn"]').click();

    cy.get('[data-testid="activity-log-details-backdrop"]').should(
      "not.exist",
    );
  });
});
