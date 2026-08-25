import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { environment } from 'src/environments/environment';

import { TeacherService } from './teacher.service';
import { TEST_TEACHER, TEST_TEACHERS } from '@app/test-data/test-teacher';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpCtrl: HttpTestingController;

  const baseUrl = `${environment.api.teachers.baseUrl}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeacherService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TeacherService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {

    it('should return all teachers', () => {
      service.all().subscribe(teachers => {
        expect(teachers).toEqual(TEST_TEACHERS);
      })
      const req = httpCtrl.expectOne(`${baseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(TEST_TEACHERS);
    });


    it('should return an error when retrieving teachers fails', () => {
      service.all().subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: error => {
          expect(error.status).toBe(404);
        }
      })

      const req = httpCtrl.expectOne(`${baseUrl}`);
      req.flush(
        { message: 'Teachers not found' },
        {
          status: 404,
          statusText: 'Not Found'
        }
      );
    });

  });

  describe('detail', () => {

    it('should return the teacher when the request succeeds', () => {
      service.detail('1').subscribe(teacher => {
        expect(teacher).toEqual(TEST_TEACHER);
      });
      const req = httpCtrl.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(TEST_TEACHER);
    });

    it('should return an error when retrieving a teacher by id fails', () => {
      service.detail('999').subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: error => {
          expect(error.status).toBe(404);
        }
      })

      const req = httpCtrl.expectOne(`${baseUrl}/999`);

      req.flush(
        { message: 'Teacher not found' },
        {
          status: 404,
          statusText: 'Not Found'
        });
    });
  });

  afterEach(() => {
    httpCtrl.verify();
  });
});
