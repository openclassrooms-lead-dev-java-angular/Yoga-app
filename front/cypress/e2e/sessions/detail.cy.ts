import { Session } from '@models/session.interface';
import { Teacher } from '@models/teacher.interface';
import { SessionInformation } from '@models/sessionInformation.interface';

describe('Session detail', () => {
    const userSession: SessionInformation = {
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

    const session: Session = {
        id: 1,
        name: 'yoga',
        description: 'Yoga session for beginners',
        date: new Date('2026-09-15T10:00:00.000Z'),
        teacher_id: 1,
        users: [],
        createdAt: new Date('2026-01-15T10:00:00.000Z'),
        updatedAt: new Date('2026-02-10T10:00:00.000Z'),
    };

    const participatingSession = {
        ...session,
        users: [1],
    } as Session;

    const teacher: Teacher = {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-10T10:00:00.000Z'),
    };

    const mockDetail = (detailSession: Session = session) => {
        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: detailSession,
        }).as('getSession');

        cy.intercept('GET', '**/api/teachers/1', {
            statusCode: 200,
            body: teacher,
        }).as('getTeacher');
    };

    const openDetail = () => {
        cy.getByDataCy('session-detail')
            .should('be.visible')
            .click();

        cy.url()
            .should('include', '/sessions/detail/1');
    };

    beforeEach(() => {
        cy.intercept('GET', '**/api/sessions', {
            statusCode: 200,
            body: [session],
        }).as('getSessions');

        cy.login(userSession);

        cy.wait('@getSessions');

        cy.getByDataCy('session-detail')
            .should('be.visible');
    });

    it('displays session information for a non-participant', () => {
        mockDetail();

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('session-card')
            .should('be.visible');

        cy.getByDataCy('session-name')
            .should('contain.text', 'Yoga');

        cy.getByDataCy('session-teacher-name')
            .should('contain.text', 'Jane')
            .and('contain.text', 'SMITH');

        cy.getByDataCy('session-attendees')
            .should('contain.text', '0 attendees');

        cy.getByDataCy('session-date')
            .should('be.visible');

        cy.get('mat-card-content')
            .should('contain.text', 'Description:')
            .and('contain.text', 'Yoga session for beginners');

        cy.contains('Create at:')
            .should('be.visible');

        cy.contains('Last update:')
            .should('be.visible');

        cy.getByDataCy('participate-button')
            .should('be.visible');

        cy.getByDataCy('unparticipate-button')
            .should('not.exist');

        cy.getByDataCy('delete-session-button')
            .should('not.exist');
    });

    it('displays the unparticipate button for a participant', () => {
        mockDetail(participatingSession);

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('session-attendees')
            .should('contain.text', '1 attendees');

        cy.getByDataCy('unparticipate-button')
            .should('be.visible');

        cy.getByDataCy('participate-button')
            .should('not.exist');

        cy.getByDataCy('delete-session-button')
            .should('not.exist');
    });

    // it('allows a user to participate', () => {
    //     let participated = false;

    //     cy.intercept('GET', '**/api/sessions/1', (req) => {
    //         req.reply({
    //             statusCode: 200,
    //             body: participated ? participatingSession : session,
    //         });
    //     }).as('getSession');

    //     cy.intercept('GET', '**/api/teachers/1', {
    //         statusCode: 200,
    //         body: teacher,
    //     }).as('getTeacher');

    //     cy.intercept('POST', '**/api/sessions/1/participate/1', {
    //         statusCode: 204,
    //     }).as('participate');

    //     cy.getByDataCy('session-detail')
    //         .should('be.visible')
    //         .click();

    //     cy.wait('@getSession');
    //     cy.wait('@getTeacher');

    //     cy.getByDataCy('participate-button')
    //         .should('be.visible')
    //         .click();

    //     cy.wait('@participate');

    //     participated = true;

    //     cy.wait('@getSession');

    //     cy.getByDataCy('unparticipate-button')
    //         .should('be.visible');

    //     cy.getByDataCy('participate-button')
    //         .should('not.exist');

    //     cy.getByDataCy('session-attendees')
    //         .should('contain.text', '1 attendees');
    // });

    it('shows an error when participation fails', () => {
        mockDetail();

        cy.intercept('POST', '**/api/sessions/1/participate/1', {
            statusCode: 500,
            body: {
                message: 'Unable to participate',
            },
        }).as('participate');

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('participate-button')
            .click();

        cy.wait('@participate');

        cy.contains('Unable to participate')
            .should('be.visible');

        cy.getByDataCy('participate-button')
            .should('be.visible');
    });

    // it('allows a participant to stop participating', () => {
    //     let participated = true;

    //     cy.intercept('GET', '**/api/sessions/1', (req) => {
    //         req.reply({
    //             statusCode: 200,
    //             body: participated ? participatingSession : session,
    //         });
    //     }).as('getSession');

    //     cy.intercept('GET', '**/api/teachers/1', {
    //         statusCode: 200,
    //         body: teacher,
    //     }).as('getTeacher');

    //     cy.intercept('DELETE', '**/api/sessions/1/participate/1', {
    //         statusCode: 204,
    //     }).as('unparticipate');

    //     cy.getByDataCy('session-detail')
    //         .should('be.visible')
    //         .click();

    //     cy.wait('@getSession');
    //     cy.wait('@getTeacher');

    //     cy.getByDataCy('unparticipate-button')
    //         .should('be.visible')
    //         .click();

    //     cy.wait('@unparticipate');

    //     participated = false;

    //     cy.wait('@getSession');

    //     cy.getByDataCy('participate-button')
    //         .should('be.visible');

    //     cy.getByDataCy('unparticipate-button')
    //         .should('not.exist');

    //     cy.getByDataCy('session-attendees')
    //         .should('contain.text', '0 attendees');
    // });

    it('shows an error when unparticipation fails', () => {
        mockDetail(participatingSession);

        cy.intercept('DELETE', '**/api/sessions/1/participate/1', {
            statusCode: 500,
            body: {
                message: 'Unable to unparticipate',
            },
        }).as('unparticipate');

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('unparticipate-button')
            .click();

        cy.wait('@unparticipate');

        cy.contains('Unable to unparticipate')
            .should('be.visible');

        cy.getByDataCy('unparticipate-button')
            .should('be.visible');
    });

    it('allows an admin to delete the session', () => {
        cy.login(adminSession);

        mockDetail();

        cy.intercept('DELETE', '**/api/sessions/1', {
            statusCode: 204,
        }).as('deleteSession');

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('delete-session-button')
            .should('be.visible')
            .click();

        cy.wait('@deleteSession');

        cy.contains('Session deleted !')
            .should('be.visible');

        cy.url()
            .should('include', '/sessions');

        cy.url()
            .should('not.include', '/sessions/detail/1');
    });

    it('shows an error when admin deletion fails', () => {
        cy.login(adminSession);

        mockDetail();

        cy.intercept('DELETE', '**/api/sessions/1', {
            statusCode: 500,
            body: {
                message: 'Unable to delete session',
            },
        }).as('deleteSession');

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('delete-session-button')
            .should('be.visible')
            .click();

        cy.wait('@deleteSession');

        cy.contains('Unable to delete session')
            .should('be.visible');

        cy.url()
            .should('include', '/sessions/detail/1');
    });

    it('shows an error when the session cannot be loaded', () => {
        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 500,
            body: {
                message: 'Unable to fetch session',
            },
        }).as('getSession');

        openDetail();

        cy.wait('@getSession');

        cy.contains('Unable to fetch session')
            .should('be.visible');

        cy.getByDataCy('session-card')
            .should('not.exist');
    });

    it('shows an error when the teacher cannot be loaded', () => {
        cy.intercept('GET', '**/api/sessions/1', {
            statusCode: 200,
            body: session,
        }).as('getSession');

        cy.intercept('GET', '**/api/teachers/1', {
            statusCode: 500,
            body: teacher,
        }).as('getTeacher');

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.contains('Unable to fetch session')
            .should('be.visible');
    });

    it('goes back to the sessions page', () => {
        mockDetail();

        openDetail();

        cy.wait('@getSession');
        cy.wait('@getTeacher');

        cy.getByDataCy('back-button')
            .click();

        cy.url()
            .should('include', '/sessions');
    });
});