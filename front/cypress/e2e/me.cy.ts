describe('Me page', () => {
    const sessionInformation = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'john.doe@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
    };

    const user = {
        id: 1,
        email: 'john.doe@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-02-10T10:00:00.000Z',
    };

    const adminUser = {
        ...user,
        admin: true,
    };

    beforeEach(() => {
        // Login mocked
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: sessionInformation,
        }).as('login');

        cy.intercept('GET', '**/api/sessions', {
            statusCode: 200,
            body: [],
        }).as('getSessions');

        cy.visit('/login');

        cy.getByDataCy('email')
            .type(sessionInformation.username);

        cy.getByDataCy('password')
            .type('password');

        cy.getByDataCy('login-btn')
            .click();

        cy.wait('@login');
        cy.wait('@getSessions');

        cy.url()
            .should('include', '/sessions');
    });

    it('displays user information', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: user,
        }).as('getUser');

        // Angular navigation withour reloading the page
        cy.get('[routerlink="me"]')
            .click();

        cy.url()
            .should('include', '/me');

        cy.wait('@getUser');

        cy.contains('h1', 'User information')
            .should('be.visible');

        cy.get('mat-card-content')
            .should('contain.text', 'Name:')
            .and('contain.text', 'John')
            .and('contain.text', 'DOE');

        cy.getByDataCy('email')
            .should('contain.text', 'john.doe@test.com');

        cy.contains('You are admin')
            .should('not.exist');

        cy.contains('Delete my account:')
            .should('be.visible');

        cy.getByDataCy('delete-user-button')
            .should('be.visible');

        cy.contains('Create at:')
            .should('be.visible');

        cy.contains('Last update:')
            .should('be.visible');
    });

    it('displays the admin message and hides account deletion', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: adminUser,
        }).as('getUser');

        cy.get('[routerlink="me"]')
            .click();

        cy.url()
            .should('include', '/me');

        cy.wait('@getUser');

        cy.contains('h1', 'User information')
            .should('be.visible');

        cy.getByDataCy('email')
            .should('contain.text', 'john.doe@test.com');

        cy.contains('You are admin')
            .should('be.visible');

        cy.contains('Delete my account:')
            .should('not.exist');

        cy.getByDataCy('delete-user-button')
            .should('not.exist');
    });

    it('displays an error when the user cannot be loaded', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 500,
            body: {
                message: 'Unable to fetch user',
            },
        }).as('getUser');

        cy.get('[routerlink="me"]')
            .click();

        cy.url()
            .should('include', '/me');

        cy.wait('@getUser');

        cy.contains('Unable to fetch user')
            .should('be.visible');
    });

    it('deletes the user account successfully', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: user,
        }).as('getUser');

        cy.intercept('DELETE', '**/api/users/1', {
            statusCode: 204,
        }).as('deleteUser');

        cy.get('[routerlink="me"]')
            .click();

        cy.url()
            .should('include', '/me');

        cy.wait('@getUser');

        cy.getByDataCy('delete-user-button')
            .click();

        cy.wait('@deleteUser');

        cy.contains('Your account has been deleted !')
            .should('be.visible');

        cy.url()
            .should('include', '/login');
    });

    it('displays an error when deleting the account fails', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: user,
        }).as('getUser');

        cy.intercept('DELETE', '**/api/users/1', {
            statusCode: 500,
            body: {
                message: 'Unable to delete your account.',
            },
        }).as('deleteUser');

        cy.get('[routerlink="me"]')
            .click();

        cy.url()
            .should('include', '/me');

        cy.wait('@getUser');

        cy.getByDataCy('delete-user-button')
            .click();

        cy.wait('@deleteUser');

        cy.contains('Unable to delete your account.')
            .should('be.visible');

        cy.url()
            .should('include', '/me');

        cy.getByDataCy('delete-user-button')
            .should('be.visible');
    });

    it('goes back to the previous page', () => {
        cy.intercept('GET', '**/api/users/1', {
            statusCode: 200,
            body: user,
        }).as('getUser');

        cy.get('[routerlink="me"]')
            .click();

        cy.url()
            .should('include', '/me');

        cy.wait('@getUser');

        cy.get('mat-card-title button')
            .click();

        cy.url()
            .should('include', '/sessions');
    });
});