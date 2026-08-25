import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { TEST_SESSION_INFORMATION } from '@app/test-data/test-auth';

describe('SessionService', () => {
  let service: SessionService;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SessionService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logged state', () => {

    it('should be logged out initially', () => {
      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(false);
      })
    });

    it('should set logged state to true when logging in', () => {
      service.logIn(TEST_SESSION_INFORMATION);
      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(true);
      })
    });

    it('should set logged state to false when logging out', () => {
      service.logIn(TEST_SESSION_INFORMATION);
      service.logOut();
      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(false);
      });
    });

    it('should update authentication state when logging in and out', () => {
      const states: boolean[] = [];

      service.$isLogged().subscribe(isLogged => {
        states.push(isLogged);
      });

      service.logIn(TEST_SESSION_INFORMATION);
      service.logOut();

      expect(states).toEqual([false, true, false]);
    });
  });

  describe('user information', () => {

    it('should store user information when logging in', () => {
      service.logIn(TEST_SESSION_INFORMATION);

      expect(service.sessionInformation).toEqual(TEST_SESSION_INFORMATION);
    })

    it('should clear user information when logging out', () => {
      service.logIn(TEST_SESSION_INFORMATION);
      service.logOut();

      expect(service.sessionInformation).toBeUndefined();
    })
  })

  afterEach(() => {
    httpCtrl.verify();
  });
});
