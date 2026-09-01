describe('Register', () => {

    beforeEach(() => {
        cy.visit('/register');
    });

    it('display form correctly', () => {
        cy.getByDataCy('first-name')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'First name');

        cy.getByDataCy('last-name')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Last name');

        cy.getByDataCy('email')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Email');

        cy.getByDataCy('password')
            .should('be.visible')
            .and('have.attr', 'placeholder', 'Password');

        cy.getByDataCy('register-btn')
            .should('be.visible')
            .and('be.disabled');

        cy.getByDataCy('form-error')
            .should('not.exist');
    });

    describe('fields validation', () => {
        it('disables the button if the form is invalid', () => {
            cy.getByDataCy('first-name')
                .type('Jo');

            cy.getByDataCy('last-name')
                .type('Do');

            cy.getByDataCy('email')
                .type('invalid-email');

            cy.getByDataCy('password')
                .type('ab');

            cy.getByDataCy('register-btn')
                .should('be.disabled');
        });

        it('enables the button when the form is valid', () => {
            cy.getByDataCy('first-name')
                .type('John');

            cy.getByDataCy('last-name')
                .type('Doe');

            cy.getByDataCy('email')
                .type('john.doe@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .should('not.be.disabled');
        });

        it('validates the length of the first name', () => {
            cy.getByDataCy('first-name')
                .type('Jo');

            cy.getByDataCy('last-name')
                .type('Doe');

            cy.getByDataCy('email')
                .type('john@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .should('be.disabled');

            cy.getByDataCy('first-name')
                .clear()
                .type('John');

            cy.getByDataCy('register-btn')
                .should('not.be.disabled');
        });

        it('validates the length of the name', () => {
            cy.getByDataCy('first-name')
                .type('John');

            cy.getByDataCy('last-name')
                .type('Do');

            cy.getByDataCy('email')
                .type('john@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .should('be.disabled');

            cy.getByDataCy('last-name')
                .clear()
                .type('Doe');

            cy.getByDataCy('register-btn')
                .should('not.be.disabled');
        });

        it('validates the maximum length of the first name', () => {
            cy.getByDataCy('first-name')
                .type('a'.repeat(21));

            cy.getByDataCy('last-name')
                .type('Doe');

            cy.getByDataCy('email')
                .type('john@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .should('be.disabled');
        });

        it('validates the maximum length of the name', () => {
            cy.getByDataCy('first-name')
                .type('John');

            cy.getByDataCy('last-name')
                .type('a'.repeat(21));

            cy.getByDataCy('email')
                .type('john@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .should('be.disabled');
        });

        it('validates the maximum password length', () => {
            cy.getByDataCy('first-name')
                .type('John');

            cy.getByDataCy('last-name')
                .type('Doe');

            cy.getByDataCy('email')
                .type('john@test.com');

            cy.getByDataCy('password')
                .type('a'.repeat(41));

            cy.getByDataCy('register-btn')
                .should('be.disabled');
        });

    });

    describe('register action', () => {
        it('redirects to the login page after successful registration', () => {
            cy.intercept('POST', '**/api/auth/register', {
                statusCode: 200,
                body: {}
            }).as('register');

            cy.getByDataCy('first-name')
                .type('John');

            cy.getByDataCy('last-name')
                .type('Doe');

            cy.getByDataCy('email')
                .type('john.doe@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .click();

            cy.wait('@register')
                .its('request.body')
                .should('deep.equal', {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@test.com',
                    password: 'password'
                });

            cy.url()
                .should('include', '/login');
        });

        it('displays an error message when registration fails', () => {
            cy.intercept('POST', '**/api/auth/register', {
                statusCode: 400,
                body: {
                    message: 'Unable to register'
                }
            }).as('register');

            cy.getByDataCy('first-name')
                .type('John');

            cy.getByDataCy('last-name')
                .type('Doe');

            cy.getByDataCy('email')
                .type('john.doe@test.com');

            cy.getByDataCy('password')
                .type('password');

            cy.getByDataCy('register-btn')
                .click();

            cy.wait('@register');

            cy.getByDataCy('display-error')
                .should('be.visible')
                .and('contain', 'An error occurred');

            cy.contains('Unable to register')
                .should('be.visible');

            cy.url()
                .should('include', '/register');
        });
    });
});