
describe('Login spec', () => {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays the login form correctly', () => {
    cy.getByDataCy('email')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Email');

    cy.getByDataCy('password')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Password');

    cy.getByDataCy('login-btn')
      .should('be.visible')
      .and('be.disabled');

    cy.getByDataCy('form-error')
      .should('not.exist');
  });

  describe('form validation for submit button', () => {

    it('displays an error message for an invalid email address', () => {
      cy.getByDataCy('email')
        .type('invalid-email');

      cy.getByDataCy('password')
        .type('password');

      cy.getByDataCy('login-btn')
        .should('be.disabled');

      cy.getByDataCy('email')
        .then(($input) => {
          expect($input[0]).to.have.property('validationMessage');
        });
    });

    describe('display submit burron', () => {

      it('disables the button if the form is invalid', () => {
        cy.getByDataCy('login-btn')
          .should('be.disabled');

        cy.getByDataCy('email')
          .type('invalid-email');

        cy.getByDataCy('password')
          .type('ab');

        cy.getByDataCy('login-btn')
          .should('be.disabled');
      });

      it('enables the button when the form is valid', () => {
        cy.getByDataCy('email')
          .type('admin@test.com');

        cy.getByDataCy('password')
          .type('password');

        cy.getByDataCy('login-btn')
          .should('not.be.disabled');
      });

    })

    it('displays the password in plain text when you click the button', () => {
      cy.getByDataCy('password')
        .should('have.attr', 'type', 'password');

      cy.getByDataCy('password-visibility-button')
        .click();

      cy.getByDataCy('password')
        .should('have.attr', 'type', 'text');

      cy.getByDataCy('password-visibility-button')
        .click();

      cy.getByDataCy('password')
        .should('have.attr', 'type', 'password');
    });

  })

  describe('login action', () => {

    it('logs in using valid credentials', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          type: 'Bearer',
          id: 1,
          username: 'admin@test.com',
          firstName: 'John',
          lastName: 'Doe',
          admin: true
        }
      }).as('login');

      cy.getByDataCy('email')
        .type('admin@test.com');

      cy.getByDataCy('password')
        .type('password');

      cy.getByDataCy('login-btn')
        .click();

      cy.wait('@login')
        .its('request.body')
        .should('deep.equal', {
          email: 'admin@test.com',
          password: 'password'
        });

      cy.url()
        .should('include', '/sessions');
    });


    it('displays an error message when the login fails', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: {
          message: 'Unauthorized'
        }
      }).as('login');

      cy.getByDataCy('email')
        .type('wrong@test.com');

      cy.getByDataCy('password')
        .type('wrong-password');

      cy.getByDataCy('login-btn')
        .click();

      cy.wait('@login');

      cy.getByDataCy('form-error')
        .should('be.visible')
        .and('contain', 'An error occurred');

      cy.contains('Unable to login')
        .should('be.visible');

      cy.url()
        .should('include', '/login');
    });



  })

});
