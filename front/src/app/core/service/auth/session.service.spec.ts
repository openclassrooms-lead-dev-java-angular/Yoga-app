import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { TEST_SESSION_INFORMATION } from '@app/test-data/test-auth';

describe('SessionService', () => {
  let service: SessionService;
  const sessionInformation = TEST_SESSION_INFORMATION;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });

    service = TestBed.inject(SessionService);
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
      service.logIn(sessionInformation);
      service.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(true);
      })
    });

    it('should set logged state to false when logging out', () => {
      service.logIn(sessionInformation);
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

      service.logIn(sessionInformation);
      service.logOut();

      expect(states).toEqual([false, true, false]);
    });
  });

  describe('user information', () => {

    it('should store user information when logging in', () => {
      service.logIn(sessionInformation);

      expect(service.sessionInformation).toEqual(sessionInformation);
    })

    it('should clear user information when logging out', () => {
      service.logIn(sessionInformation);
      service.logOut();

      expect(service.sessionInformation).toBeUndefined();
    })
  })
});
