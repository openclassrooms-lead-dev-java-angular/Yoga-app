import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { environment } from 'src/environments/environment';

import { TEST_SESSION, TEST_SESSIONS } from '@app/test-data/test-session';
import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {

  let service: SessionApiService;
  let httpCtrl: HttpTestingController;
  const baseUrl = `${environment.api.sessions.baseUrl}`;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        SessionApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SessionApiService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {

    it('should return all sessions', () => {
      service.all().subscribe(sessions => {
        expect(sessions).toEqual(TEST_SESSIONS);
      });
      const req = httpCtrl.expectOne(`${baseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(TEST_SESSIONS);
    });
  })

  describe('detail', () => {

    it('should return a session by id', () => {
      service.detail('1').subscribe(session => {
        expect(session).toEqual(TEST_SESSION);
      });
      const req = httpCtrl.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(TEST_SESSION);
    })

    it('should propagate a 404 error when the session does not exist', () => {
      service.detail('999').subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpCtrl.expectOne(`${baseUrl}/999`);

      req.flush(
        { message: 'Session not found' },
        {
          status: 404,
          statusText: 'Not Found'
        }
      );
    })

    describe('create', () => {

      it('should create a session', () => {
        service.create(TEST_SESSION).subscribe(session => {
          expect(session).toEqual(TEST_SESSION);
        })
        const req = httpCtrl.expectOne(`${baseUrl}`);
        expect(req.request.method).toBe('POST');
        req.flush(TEST_SESSION);
      })

      it('should propagate a 400 error when creating an invalid session', () => {
        service.create(TEST_SESSION).subscribe({
          next: () => {
            throw new Error('Expected an error');
          },
          error: error => {
            expect(error.status).toBe(400);
          }
        });

        const req = httpCtrl.expectOne(`${baseUrl}`);

        req.flush(
          { message: 'Invalid session data' },
          {
            status: 400,
            statusText: 'Bad Request'
          }
        );
      });
    })

    describe('delete', () => {

      it('should delete a session', () => {
        let completed = false;
        service.delete('1').subscribe({
          complete: () => completed = true
        });
        const req = httpCtrl.expectOne(`${baseUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
        expect(completed).toBe(true);
      })

      it('should propagate a 403 error when deleting a session is forbidden', () => {
        service.delete('1').subscribe({
          next: () => {
            throw new Error('Expected an error');
          },
          error: error => {
            expect(error.status).toBe(403);
          }
        });

        const req = httpCtrl.expectOne(`${baseUrl}/1`);

        req.flush(
          { message: 'Access denied' },
          {
            status: 403,
            statusText: 'Forbidden'
          }
        );
      });

      it('should propagate a 401 error when the user is not authenticated', () => {
        service.delete('1').subscribe({
          next: () => {
            throw new Error('Expected an error');
          },
          error: error => {
            expect(error.status).toBe(401);
          }
        });

        const req = httpCtrl.expectOne(`${baseUrl}/1`);

        req.flush(
          { message: 'Unauthorized' },
          {
            status: 401,
            statusText: 'Unauthorized'
          }
        );
      });
    })
  })

  describe('update', () => {
    it('should update a session', () => {
      service.update('1', TEST_SESSION).subscribe(session => {
        expect(session).toEqual(TEST_SESSION);
      })
      const req = httpCtrl.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(TEST_SESSION);
    })
  })

  describe('participate', () => {
    it('should participate in a session', () => {
      let completed = false;
      service.participate('1', '1').subscribe({
        complete: () => completed = true
      });
      const req = httpCtrl.expectOne(`${baseUrl}/1/participate/1`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(null);
      expect(completed).toBe(true);
    })
  })

  describe('unParticipate', () => {
    it('should remove a user from a session', () => {
      let completed = false;
      service.unParticipate('1', '1').subscribe({
        complete: () => completed = true
      });
      const req = httpCtrl.expectOne(`${baseUrl}/1/participate/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      expect(completed).toBe(true);
    })
  })

  afterEach(() => {
    httpCtrl.verify();
  })
});
