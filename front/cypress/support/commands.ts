// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { SessionInformation } from '@models/sessionInformation.interface';

declare global {
    namespace Cypress {
        interface Chainable {
            getByDataCy(
                selector: string,
                options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
            ): Chainable<JQuery<HTMLElement>>;
            login(sessionInformation: SessionInformation): Chainable<void>;
        }
    }
}

Cypress.Commands.add('getByDataCy', (selector: string, ...args: any[]) => {
    return cy.get(`[data-cy="${selector}"]`, ...args)
});

Cypress.Commands.add(
    'login',
    (sessionInformation: SessionInformation) => {
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: sessionInformation,
        }).as('login');

        cy.visit('/login');

        cy.getByDataCy('email')
            .type(sessionInformation.username);

        cy.getByDataCy('password')
            .type('password');

        cy.getByDataCy('login-btn')
            .click();

        cy.wait('@login');

        cy.url()
            .should('include', '/sessions');
    }
);

export { };