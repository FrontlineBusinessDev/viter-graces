describe("Sales Journal Module - Filters", () => {
  beforeEach(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.visit("/developer/sales-journal");
  });

  // ORDER NUMBER
  it("Should filter the order number as the user types", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );

    cy.get('[data-testid="sales_journal_order_number"]').type("ORD");

    cy.wait("@getSalesJournal");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_journal_order_number"]').clear();
  });

  // DATE
  it("Should filter by date", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );

    cy.get('[data-testid="sales_journal_date"]').type("2026-08-14");

    cy.wait("@getSalesJournal");

    cy.get('[data-testid="sales_journal_date"]').clear();
  });

  // CUSTOMER
  it("Should filter by customer", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );

    cy.get('[data-testid="filter-customer"]').click();
    cy.get('[data-testid="filter-customer"] .react-select__option')
      .first()
      .then(($option) => {
        const customerName = $option.text();
        cy.wrap($option).click();

        cy.wait("@getSalesJournal");

        cy.contains('[data-testid="table-row"]', customerName).should(
          "exist",
        );
      });

    cy.get(
      '[data-testid="filter-customer"] .react-select__clear-indicator',
    ).click();
  });

  // METHOD
  it("Should filter the method as the user types", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );

    cy.get('[data-testid="sales_journal_method"]').type("cash");

    cy.wait("@getSalesJournal");
    cy.get('[data-testid="table-row"]').should("have.length.greaterThan", 0);

    cy.get('[data-testid="sales_journal_method"]').clear();
  });

  // DEBIT
  it("Should filter by min debit", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );
    cy.get('[data-testid="sales_journal_debit_min"]').type("1");

    cy.wait("@getSalesJournal");

    cy.get('[data-testid="sales_journal_debit_min"]').clear();
  });

  // CREDIT
  it("Should filter by min credit", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );
    cy.get('[data-testid="sales_journal_credit_min"]').type("0");

    cy.wait("@getSalesJournal");

    cy.get('[data-testid="sales_journal_credit_min"]').clear();
  });

  // BALANCE
  it("Should filter by min balance", () => {
    cy.intercept("POST", "**/finance-sales-journal/page/*").as(
      "getSalesJournal",
    );
    cy.get('[data-testid="sales_journal_balance_min"]').type("1");

    cy.wait("@getSalesJournal");

    cy.get('[data-testid="sales_journal_balance_min"]').clear();
  });
});
