import { Session } from "@models/session.interface";

describe('Sessions list', () => {
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

    const yogaSession: Session = {
        id: 1,
        name: 'Yoga',
        description: 'Yoga session for beginners',
        date: new Date('2026-09-15T10:00:00.000Z'),
        teacher_id: 1,
        users: [],
        createdAt: new Date('2026-01-15T10:00:00.000Z'),
        updatedAt: new Date('2026-02-10T10:00:00.000Z'),
    };

    const cardioSession: Session = {
        id: 2,
        name: 'Cardio',
        description: 'Cardio session for everyone',
        date: new Date('2026-09-20T14:00:00.000Z'),
        teacher_id: 2,
        users: [1],
        createdAt: new Date('2026-01-20T10:00:00.000Z'),
        updatedAt: new Date('2026-02-15T10:00:00.000Z'),
    };

    const visitSessions = (
        sessionInformation = userSession,
        sessions: Session[] = [yogaSession]
    ) => {
        cy.intercept('GET', '**/api/sessions', {
            statusCode: 200,
            body: sessions,
        }).as('getSessions');

        cy.login(sessionInformation);

        cy.wait('@getSessions');

        cy.url()
            .should('include', '/sessions');
    };

    it('displays the sessions list', () => {
        visitSessions();

        cy.contains('Rentals available')
            .should('be.visible');

        cy.getByDataCy('session-card')
            .should('have.length', 1);

        cy.getByDataCy('session-card')
            .should('contain.text', 'Yoga')
            .and('contain.text', 'Yoga session for beginners');

        cy.getByDataCy('session-detail')
            .should('be.visible')
            .and('have.length', 1);

        cy.getByDataCy('edit-session-button')
            .should('not.exist');
    });

    it('displays multiple sessions', () => {
        visitSessions(userSession, [
            yogaSession,
            cardioSession,
        ]);

        cy.getByDataCy('session-card')
            .should('have.length', 2);

        cy.getByDataCy('session-card')
            .eq(0)
            .should('contain.text', 'Yoga')
            .and('contain.text', 'Yoga session for beginners');

        cy.getByDataCy('session-card')
            .eq(1)
            .should('contain.text', 'Cardio')
            .and('contain.text', 'Cardio session for everyone');

        cy.getByDataCy('session-detail')
            .should('have.length', 2);
    });

    it('does not display admin actions for a regular user', () => {
        visitSessions();

        cy.get('mat-card-header')
            .should('contain.text', 'Rentals available');

        cy.contains('button', 'Create')
            .should('not.exist');

        cy.getByDataCy('edit-session-button')
            .should('not.exist');
    });

    it('displays the create button for an admin', () => {
        visitSessions(adminSession);

        cy.contains('button', 'Create')
            .should('be.visible');

        cy.getByDataCy('session-detail')
            .should('be.visible');

        cy.getByDataCy('edit-session-button')
            .should('be.visible');
    });

    it('displays edit buttons for an admin on each session', () => {
        visitSessions(adminSession, [
            yogaSession,
            cardioSession,
        ]);

        cy.getByDataCy('edit-session-button')
            .should('have.length', 2);

        cy.getByDataCy('edit-session-button')
            .eq(0)
            .should('contain.text', 'Edit');

        cy.getByDataCy('edit-session-button')
            .eq(1)
            .should('contain.text', 'Edit');
    });

    it('navigates to the session detail page', () => {
        visitSessions();

        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: yogaSession,
        }).as('getSession');

        cy.intercept('GET', '**/api/teachers/1', {
            statusCode: 200,
            body: {
                id: 1,
                firstName: 'Jane',
                lastName: 'Smith',
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-10T10:00:00.000Z',
            },
        }).as('getTeacher');

        cy.getByDataCy('session-detail')
            .click();

        cy.url()
            .should('include', '/sessions/detail/1');

        cy.wait('@getSession');
        cy.wait('@getTeacher');
    });

    it('displays an empty list when there are no sessions', () => {
        visitSessions(userSession, []);

        cy.contains('Rentals available')
            .should('be.visible');

        cy.getByDataCy('session-card')
            .should('not.exist');

        cy.getByDataCy('session-detail')
            .should('not.exist');

        cy.getByDataCy('edit-session-button')
            .should('not.exist');
    });

    it('navigates to the create page for an admin', () => {
        visitSessions(adminSession);

        cy.contains('button', 'Create')
            .should('be.visible')
            .click();

        cy.url()
            .should('include', '/sessions/create');
    });

    it('navigates to the update page for an admin', () => {
        visitSessions(adminSession);

        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: yogaSession,
        }).as('getSession');

        cy.getByDataCy('edit-session-button')
            .click();

        cy.url()
            .should('include', '/sessions/update/1');

        cy.wait('@getSession');
    });

});