import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { expect } from '@jest/globals';
import { environment } from "src/environments/environment";

import { AuthService } from "./auth.service";
import {
    TEST_LOGIN_REQUEST,
    TEST_REGISTER_REQUEST,
    TEST_SESSION_INFORMATION
} from "@app/test-data/test-auth";

describe('AuthService', () => {

    let service: AuthService;
    let httpCtrl: HttpTestingController;
    const baseUrl = `${environment.api.auth.baseUrl}`;

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

        it('should send the registration request with the correct payload', () => {
            let completed = false;
            service.register(TEST_REGISTER_REQUEST).subscribe({
                complete: () => completed = true
            });
            const req = httpCtrl.expectOne(`${baseUrl}/register`);
            expect(req.request.body).toEqual(TEST_REGISTER_REQUEST);
            req.flush(null);
            expect(completed).toBe(true);
        });

        it('should reject registration when email already exists', () => {
            service.register(TEST_REGISTER_REQUEST).subscribe({
                next: () => ({ message: 'Registration should have failed' }),
                error: error => {
                    expect(error.status).toBe(400);
                }
            });

            const req = httpCtrl.expectOne(`${baseUrl}/register`);

            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(TEST_REGISTER_REQUEST);

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

        it('should login successfully', () => {
            let completed = false;
            service.login(TEST_LOGIN_REQUEST).subscribe({
                complete: () => completed = true
            });
            const req = httpCtrl.expectOne(`${baseUrl}/login`);

            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(TEST_LOGIN_REQUEST);
            req.flush(null);
            expect(completed).toBe(true);
        });

        it('should return session information when login succeeds', () => {
            service.login(TEST_LOGIN_REQUEST).subscribe(response => {
                expect(response).toEqual(TEST_SESSION_INFORMATION);
            });

            const req = httpCtrl.expectOne(`${baseUrl}/login`);

            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(TEST_LOGIN_REQUEST);

            req.flush(TEST_SESSION_INFORMATION);
        });

        it('should reject invalid credentials', () => {
            service.login(TEST_LOGIN_REQUEST).subscribe({
                next: () => {
                    throw new Error('Expected an error');
                },
                error: error => {
                    expect(error.status).toBe(401);
                }
            });

            const req = httpCtrl.expectOne(`${baseUrl}/login`);

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