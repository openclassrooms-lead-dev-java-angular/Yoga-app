import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { expect } from '@jest/globals';

import { AuthService } from "./auth.service";
import {
    TEST_LOGIN_REQUEST,
    TEST_REGISTER_REQUEST,
    TEST_SESSION_INFORMATION
} from "@app/test-data/test-auth";

describe('AuthService', () => {

    let service: AuthService;
    let httpCtrl: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(AuthService);
        httpCtrl = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('register', () => {

        const registerRequest = TEST_REGISTER_REQUEST;

        it('should send the registration request with the correct payload', () => {
            service.register(registerRequest).subscribe();
            const req = httpCtrl.expectOne('/api/auth/register');
            expect(req.request.body).toEqual(registerRequest);
        });

        it('should reject registration when email already exists', () => {
            service.register(registerRequest).subscribe({
                next: () => ({ message: 'Registration should have failed' }),
                error: error => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpCtrl.expectOne('/api/auth/register');

            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(registerRequest);

            req.flush(
                { message: 'Email already exists' },
                {
                    status: 400,
                    statusText: 'Bad Request'
                }
            );
        });
    });

    describe('login', () => {

        const loginRequest = TEST_LOGIN_REQUEST;

        it('should login successfully', () => {
            service.login(loginRequest).subscribe();
            const req = httpCtrl.expectOne('/api/auth/login');

            expect(req.request.method).toEqual('POST');

            expect(req.request.body).toEqual(loginRequest);
        });

        it('should return session information when login succeeds', () => {
            service.login(loginRequest).subscribe(response => {
                expect(response).toEqual(TEST_SESSION_INFORMATION);
            });

            const req = httpCtrl.expectOne('/api/auth/login');

            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(loginRequest);

            req.flush(TEST_SESSION_INFORMATION);
        });

        it('should reject invalid credentials', () => {
            service.login(loginRequest).subscribe({
                next: () => { message: 'Login should have failed' },
                error: error => {
                    expect(error.status).toBe(401);
                }
            });

            const req = httpCtrl.expectOne('/api/auth/login');

            req.flush(
                { message: 'Unauthorized' },
                { status: 401, statusText: 'Unauthorized' }
            );
        });
    });

    afterEach(() => {
        httpCtrl.verify();
    });
});