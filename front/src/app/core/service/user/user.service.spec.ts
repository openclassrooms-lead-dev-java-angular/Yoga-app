import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { environment } from 'src/environments/environment';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TEST_USER } from '@app/test-data/data/test-user';

describe('UserService', () => {
  let service: UserService;
  let httpCtrl: HttpTestingController;
  const baseUrl = `${environment.api.users.baseUrl}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {

    it('should return a user by id', () => {
      service.getById('1').subscribe(user => {
        expect(user).toEqual(TEST_USER);
      })

      const req = httpCtrl.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(TEST_USER);
    });

    it('should propagate a 404 error when the user does not exist', () => {
      service.getById('999').subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpCtrl.expectOne(`${baseUrl}/999`);
      req.flush(
        { message: 'User not found' },
        {
          status: 404,
          statusText: 'Not Found'
        }
      );
    });

    it('should propagate a 401 error when the user is not authenticated', () => {
      service.getById('1').subscribe({
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

  });

  describe('delete', () => {

    it('should delete a user', () => {
      let completed = false;

      service.delete('1').subscribe({
        complete: () => {
          completed = true;
        }
      });

      const req = httpCtrl.expectOne(`${baseUrl}/1`);

      expect(req.request.method).toBe('DELETE');

      req.flush(null);

      expect(completed).toBe(true);
    });

    it('should propagate a 404 error when the user does not exist', () => {
      service.delete('999').subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpCtrl.expectOne(`${baseUrl}/999`);

      req.flush(
        { message: 'User not found' },
        {
          status: 404,
          statusText: 'Not Found'
        }
      );
    });

    it('should propagate a 401 error when the user is not authenticated', () => {
      service.delete('1').subscribe({
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

    it('should propagate a 403 error when the user is not authorized to delete the user', () => {
      service.delete('1').subscribe({
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

  });

  afterEach(() => {
    httpCtrl.verify();
  })
});
