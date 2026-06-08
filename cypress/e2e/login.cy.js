describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/portal/login");
  });

  it("should display login page correctly", () => {
    cy.contains("LOG IN").should("be.visible");
    cy.contains("Please Login using your account").should("be.visible");

    cy.get('input[name="user_account_email"]').should("exist");
    cy.get('input[name="password"]').should("exist");

    cy.get('button[type="submit"]').should("exist").and("contain", "Login");
  });

  it("should allow user to type email and password", () => {
    cy.get('input[name="user_account_email"]')
      .type("admin@gmail.com")
      .should("have.value", "admin@gmail.com");

    cy.get('input[name="password"]')
      .type("password123")
      .should("have.value", "password123");
  });

  it("should login successfully with valid credentials", () => {
    cy.intercept("POST", "**/users/login").as("loginRequest");

    cy.get('input[name="user_account_email"]').type("louren.rubico@frontlinebusiness.com.ph");

    cy.get('input[name="password"]').type(("Louren23!"));

    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    // Verify redirect occurred
    cy.url().should("not.include", "/login");
  });

  it("should show error message for invalid credentials", () => {
    cy.intercept("POST", "**/users/login").as("loginRequest");

    cy.get('input[name="user_account_email"]').type("invalid@gmail.com");

    cy.get('input[name="password"]').type("invalidpassword");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.contains("Invalid email or password").should("be.visible");
  });

  it("should disable login button while request is processing", () => {
    cy.intercept("POST", "**/users/login", (req) => {
      req.reply((res) => {
        res.delay = 2000;
        res.send();
      });
    }).as("loginRequest");

    cy.get('input[name="user_account_email"]').type(
      "louren.rubico@frontlinebusiness.com.ph",
    );

    cy.get('input[name="password"]').type("Louren23!");

    cy.get('button[type="submit"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.wait("@loginRequest");
  });

  it("should navigate to forgot password page", () => {
    cy.contains("Forgot password?").click();

    cy.url().should("include", "/forgot-password");
  });

  it("should toggle password visibility", () => {
    cy.get('input[name="password"]').type("password123");

    // Click Eye icon
    cy.get("svg").last().click();

    cy.get('input[name="password"]').should("have.attr", "type", "text");
  });

  it("redirects to dashboard on success", () => {
    cy.get('input[name="user_account_email"]').type(
      "louren.rubico@frontlinebusiness.com.ph",
    );
    cy.get('input[name="password"]').type("Louren23!");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
  });
});
