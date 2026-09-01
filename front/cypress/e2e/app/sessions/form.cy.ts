describe('Session form', () => {
    const userSession = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'john.doe@test.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
    };

    const adminSession = {
        ...userSession,
        admin: true,
    };

    const session = {
        id: 1,
        name: 'Yoga',
        description: 'Yoga session for beginners',
        date: '2026-09-15T10:00:00.000Z',
        teacher_id: 1,
        users: [],
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-02-10T10:00:00.000Z',
    };

    const teacher = {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z',
    };

    const mockSessionsList = () => {
        cy.intercept('GET', '**/api/sessions', {
            statusCode: 200,
            body: [session],
        }).as('getSessions');
    };

    const mockTeachers = () => {
        cy.intercept('GET', '**/api/teachers', {
            statusCode: 200,
            body: [teacher],
        }).as('getTeachers');
    };

    const openCreate = () => {
        cy.contains('button', 'Create')
            .should('be.visible')
            .click();

        cy.url()
            .should('include', '/sessions/create');
    };

    const openUpdate = () => {
        cy.getByDataCy('edit-session-button')
            .should('be.visible')
            .click();

        cy.url()
            .should('include', '/sessions/update/1');
    };

    beforeEach(() => {
        mockSessionsList();
        cy.login(adminSession);

        cy.wait('@getSessions');

        cy.getByDataCy('edit-session-button')
            .should('be.visible');
    });

    it('displays the create form', () => {
        mockTeachers();

        openCreate();

        cy.wait('@getTeachers');

        cy.contains('h1', 'Create session')
            .should('be.visible');

        cy.getByDataCy('input-name')
            .should('be.visible')
            .and('have.value', '');

        cy.getByDataCy('input-date')
            .should('be.visible')
            .and('have.value', '');

        cy.getByDataCy('session-teacher-select')
            .should('be.visible');

        cy.getByDataCy('input-description')
            .should('be.visible')
            .and('have.value', '');

        cy.contains('button', 'Save')
            .should('be.visible')
            .and('be.disabled');
    });

    it('loads teachers in the create form', () => {
        mockTeachers();

        openCreate();

        cy.wait('@getTeachers');

        cy.getByDataCy('session-teacher-select')
            .click();

        cy.contains('mat-option', 'Jane Smith')
            .should('be.visible');
    });

    it('enables save when the create form is valid', () => {
        mockTeachers();

        openCreate();

        cy.wait('@getTeachers');

        cy.getByDataCy('input-name')
            .type('Yoga');

        cy.getByDataCy('input-date')
            .type('2026-09-15');

        cy.getByDataCy('session-teacher-select')
            .click();

        cy.contains('mat-option', 'Jane Smith')
            .click();

        cy.getByDataCy('input-description')
            .type('Yoga session for beginners');

        cy.contains('button', 'Save')
            .should('not.be.disabled');
    });

    it('does not enable save when a required field is missing', () => {
        mockTeachers();

        openCreate();

        cy.wait('@getTeachers');

        cy.getByDataCy('input-name')
            .type('Yoga');

        cy.getByDataCy('input-date')
            .type('2026-09-15');

        cy.getByDataCy('session-teacher-select')
            .click();

        cy.contains('mat-option', 'Jane Smith')
            .click();

        // Description volontairement vide
        cy.contains('button', 'Save')
            .should('be.disabled');
    });

    it('does not enable save when description exceeds 2000 characters', () => {
        mockTeachers();

        openCreate();

        cy.wait('@getTeachers');

        cy.getByDataCy('input-name')
            .type('Yoga');

        cy.getByDataCy('input-date')
            .type('2026-09-15');

        cy.getByDataCy('session-teacher-select')
            .click();

        cy.contains('mat-option', 'Jane Smith')
            .click();

        cy.getByDataCy('input-description')
            .type('a'.repeat(2001), { delay: 0 });

        cy.contains('button', 'Save')
            .should('be.disabled');
    });

    it('creates a session successfully', () => {
        mockTeachers();

        cy.intercept('POST', '**/api/sessions', {
            statusCode: 201,
            body: session,
        }).as('createSession');

        openCreate();

        cy.wait('@getTeachers');

        cy.getByDataCy('input-name')
            .type('Yoga');

        cy.getByDataCy('input-date')
            .type('2026-09-15');

        cy.getByDataCy('session-teacher-select')
            .click();

        cy.contains('mat-option', 'Jane Smith')
            .click();

        cy.getByDataCy('input-description')
            .type('Yoga session for beginners');

        cy.contains('button', 'Save')
            .should('not.be.disabled')
            .click();

        cy.wait('@createSession')
            .its('request.body')
            .should('deep.equal', {
                name: 'Yoga',
                date: '2026-09-15',
                teacher_id: 1,
                description: 'Yoga session for beginners',
            });

        cy.contains('Session created !')
            .should('be.visible');

        cy.url()
            .should('include', '/sessions');
    });

    it('displays the update form with existing values', () => {
        mockTeachers();

        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: session,
        }).as('getSession');

        openUpdate();

        cy.wait('@getTeachers');
        cy.wait('@getSession');

        cy.contains('h1', 'Update session')
            .should('be.visible');

        cy.getByDataCy('input-name')
            .should('have.value', 'Yoga');

        cy.getByDataCy('input-date')
            .should('have.value', '2026-09-15');

        cy.getByDataCy('input-description')
            .should('have.value', 'Yoga session for beginners');

        cy.getByDataCy('session-teacher-select')
            .should('contain.text', 'Jane Smith');

        cy.contains('button', 'Save')
            .should('not.be.disabled');
    });

    it('updates a session successfully', () => {
        mockTeachers();

        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: session,
        }).as('getSession');

        cy.intercept('PUT', '**/api/sessions/1', {
            statusCode: 200,
            body: {
                ...session,
                name: 'Updated Yoga',
            },
        }).as('updateSession');

        openUpdate();

        cy.wait('@getTeachers');
        cy.wait('@getSession');

        cy.getByDataCy('input-name')
            .clear()
            .type('Updated Yoga');

        cy.contains('button', 'Save')
            .click();

        cy.wait('@updateSession')
            .its('request.body')
            .should('deep.equal', {
                name: 'Updated Yoga',
                date: '2026-09-15',
                teacher_id: 1,
                description: 'Yoga session for beginners',
            });

        cy.contains('Session updated !')
            .should('be.visible');

        cy.url()
            .should('include', '/sessions');
    });

    it('shows an error when updating a session fails', () => {
        mockTeachers();

        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: session,
        }).as('getSession');

        cy.intercept('PUT', '**/api/sessions/1', {
            statusCode: 500,
            body: {
                message: 'Unable to update session',
            },
        }).as('updateSession');

        openUpdate();

        cy.wait('@getTeachers');
        cy.wait('@getSession');

        cy.getByDataCy('input-name')
            .clear()
            .type('Updated Yoga');

        cy.contains('button', 'Save')
            .click();

        cy.wait('@updateSession');

        cy.contains('Unable to update session')
            .should('be.visible');

        cy.url()
            .should('include', '/sessions/update/1');
    });

    // it('shows an error when loading the session for update fails', () => {
    //     mockTeachers();

    //     cy.intercept('GET', '**/api/sessions/1', {
    //         statusCode: 500,
    //         body: {
    //             message: 'Unable to fetch session',
    //         },
    //     }).as('getSession');

    //     openUpdate();

    //     cy.wait('@getTeachers');
    //     cy.wait('@getSession');

    //     cy.contains('Unable to fetch session')
    //         .should('be.visible');

    //     cy.contains('h1', 'Update session')
    //         .should('be.visible');
    // });

    it('goes back to sessions from the create form', () => {
        mockTeachers();

        openCreate();

        cy.wait('@getTeachers');

        cy.getByDataCy('back-button')
            .click();

        cy.url()
            .should('include', '/sessions');
    });

    it('goes back to sessions from the update form', () => {
        mockTeachers();

        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: session,
        }).as('getSession');

        openUpdate();

        cy.wait('@getTeachers');
        cy.wait('@getSession');

        cy.getByDataCy('back-button')
            .click();

        cy.url()
            .should('include', '/sessions');
    });

});