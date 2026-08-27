import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { expect, jest } from '@jest/globals';
import { Observable, of, throwError } from 'rxjs';

import { DetailComponent } from './detail.component';
import { SessionService } from '@core/service/auth/session.service';
import { SessionApiService } from '@app/core/service/session/session-api.service';
import { TEST_SESSION_INFORMATION_ADMIN } from '@app/test-data/data/test-auth';
import { TEST_SESSION, TEST_SESSION_NOT_PARTICIPATE } from '@app/test-data/data/test-session';
import { TeacherService } from '@app/core/service/teacher/teacher.service';
import { TEST_TEACHER } from '@app/test-data/data/test-teacher';
import { Session } from '@app/core/models/session.interface';
import { Teacher } from '@app/core/models/teacher.interface';
import { By } from '@angular/platform-browser';
import { displayedDate } from '@app/test-data/helpers/date.helper';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let location: Location;
  let router: Router;
  let matSnackBarMock: {
    open: jest.Mock;
  };
  let teacherServiceMock: jest.Mocked<
    Pick<TeacherService, 'detail'>
  >;
  let sessionApiServiceMock: jest.Mocked<
    Pick<
      SessionApiService,
      'detail' | 'delete' | 'participate' | 'unParticipate'
    >
  >;
  let mockSessionService = {
    sessionInformation: TEST_SESSION_INFORMATION_ADMIN,
  }

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('123'),
      },
    },
  };

  beforeEach(async () => {

    matSnackBarMock = {
      open: jest.fn(),
    };

    sessionApiServiceMock = {
      detail: jest.fn<(id: string) => Observable<Session>>()
        .mockReturnValue(of(TEST_SESSION)),

      delete: jest.fn<(id: string) => Observable<void>>()
        .mockReturnValue(of(void 0)),

      participate: jest.fn<(id: string, userId: string) => Observable<void>>()
        .mockReturnValue(of(void 0)),

      unParticipate: jest.fn<(id: string, userId: string) => Observable<void>>()
        .mockReturnValue(of(void 0)),
    };

    teacherServiceMock = {
      detail: jest.fn<(id: string) => Observable<Teacher>>()
        .mockReturnValue(of(TEST_TEACHER)),
    };

    await TestBed.configureTestingModule({
      imports: [
        DetailComponent,
        MatSnackBarModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: SessionApiService,
          useValue: sessionApiServiceMock,
        },
        {
          provide: TeacherService,
          useValue: teacherServiceMock,
        },
        {
          provide: Location,
          useValue: {
            back: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(DetailComponent, {
        set: {
          providers: [
            {
              provide: MatSnackBar,
              useValue: matSnackBarMock,
            },
          ],
        },
      })
      .compileComponents();

    location = TestBed.inject(Location);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should initialize the session ID from the route', () => {
      component.ngOnInit();

      expect(component.sessionId).toBe('123');
      expect(activatedRouteMock.snapshot.paramMap.get)
        .toHaveBeenCalledWith('id');
    });

    it('should initialize the admin status from the current session', () => {
      component.ngOnInit();

      expect(component.isAdmin).toBe(
        mockSessionService.sessionInformation.admin
      );
    });

    it('should initialize the user ID from the current session', () => {
      component.ngOnInit();

      expect(component.userId).toBe(
        mockSessionService.sessionInformation.id.toString()
      );
    });

    it('should fetch the session and teacher on initialization', () => {
      component.ngOnInit();

      expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('123');
      expect(teacherServiceMock.detail).toHaveBeenCalledWith(
        TEST_SESSION.teacher_id.toString()
      );

      expect(component.session).toEqual(TEST_SESSION);
      expect(component.teacher).toEqual(TEST_TEACHER);
    });

    it('should set participation status to true when the user participates in the session', () => {
      sessionApiServiceMock.detail
        .mockReturnValue(of(TEST_SESSION));
      component.ngOnInit();

      expect(component.isParticipate).toBe(true);
    });

    it('should set participation status to false when the user is not in the session', () => {
      sessionApiServiceMock.detail
        .mockReturnValue(of(TEST_SESSION_NOT_PARTICIPATE));
      component.ngOnInit();

      expect(component.isParticipate).toBe(false);
    });

    it('should display an error message when fetching the session fails', () => {
      sessionApiServiceMock.detail
        .mockReturnValue(throwError(() => new Error('Unable to fetch session')));
      component.ngOnInit();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to fetch session',
        'Close',
        { duration: 3000 }
      );
    });

    it('should display an error message when fetching the teacher fails', () => {
      teacherServiceMock.detail.mockReturnValue(
        throwError(() => new Error('Unable to fetch teacher'))
      );
      component.ngOnInit();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to fetch session',
        'Close',
        { duration: 3000 }
      );
    });

  });

  describe('back', () => {

    it('should navigate back to the previous page', () => {
      component.back();

      expect(location.back).toHaveBeenCalled();
    });

  });

  describe('delete', () => {

    it('should delete the session and navigate to the sessions page on success', () => {
      component.sessionId = '123';
      component.delete();

      expect(sessionApiServiceMock.delete)
        .toHaveBeenCalledWith('123');

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Session deleted !',
        'Close',
        { duration: 3000 }
      );

      expect(router.navigate)
        .toHaveBeenCalledWith(['sessions']);
    });

    it('should delete the session when clicking the delete button', () => {
      mockSessionService.sessionInformation.admin = true;

      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-session-button"]')
      );

      deleteButton.triggerEventHandler('click', null);

      expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('123');
      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Session deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should display an error message when deleting the session fails', () => {
      sessionApiServiceMock.delete.mockReturnValue(
        throwError(() => new Error('Unable to delete session'))
      );

      component.sessionId = '123';
      component.delete();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to delete session',
        'Close',
        { duration: 3000 }
      );

      expect(router.navigate).not.toHaveBeenCalled();
    });

  });

  describe('participate', () => {

    it('should participate in the session and fetch the session again on success', () => {
      component.sessionId = '123';
      component.userId = '1';

      component.participate();

      expect(sessionApiServiceMock.participate)
        .toHaveBeenCalledWith('123', '1');

      expect(sessionApiServiceMock.detail)
        .toHaveBeenCalledWith('123');
    });

    it('should refresh the session after participating successfully', () => {
      component.sessionId = '123';
      component.userId = '1';

      component.participate();

      expect(sessionApiServiceMock.participate)
        .toHaveBeenCalledWith('123', '1');

      expect(component.session).toEqual(TEST_SESSION);
      expect(component.teacher).toEqual(TEST_TEACHER);
    });

    it('should display an error message when participating in the session fails', () => {
      sessionApiServiceMock.participate.mockReturnValue(
        throwError(() => new Error('Unable to participate'))
      );

      component.ngOnInit();
      component.participate();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to participate',
        'Close',
        { duration: 3000 }
      );
    });

  });

  describe('unParticipate', () => {

    it('should cancel participation in the session and fetch the session again on success', () => {
      component.sessionId = '123';
      component.userId = '1';

      component.unParticipate();

      expect(sessionApiServiceMock.unParticipate)
        .toHaveBeenCalledWith('123', '1');

      expect(sessionApiServiceMock.detail)
        .toHaveBeenCalledWith('123');
    });

    it('should refresh the session after cancelling participation successfully', () => {
      component.sessionId = '123';
      component.userId = '1';

      component.unParticipate();

      expect(sessionApiServiceMock.unParticipate)
        .toHaveBeenCalledWith('123', '1');

      expect(component.session).toEqual(TEST_SESSION);
      expect(component.teacher).toEqual(TEST_TEACHER);
    });

    it('should display an error message when cancelling participation fails', () => {
      sessionApiServiceMock.unParticipate.mockReturnValue(
        throwError(() => new Error('Unable to unparticipate'))
      );

      component.ngOnInit();
      component.unParticipate();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to unparticipate',
        'Close',
        { duration: 3000 }
      );
    });

  });

  describe('template', () => {

    it('should display the session details', () => {
      fixture.detectChanges();

      const content = fixture.nativeElement.textContent
      const createdAt = displayedDate(TEST_SESSION.createdAt as Date);
      const updatedAt = displayedDate(TEST_SESSION.updatedAt as Date);

      expect(content).toContain('Session De Yoga Débutant');
      expect(content).toContain('Une session de yoga pour débutants');
      expect(content).toContain(`Create at:  ${createdAt}`);
      expect(content).toContain(`Last update:  ${updatedAt}`);
    });

    it('should not display session details when session is undefined', () => {
      sessionApiServiceMock.detail.mockReturnValue(
        throwError(() => new Error('Unable to fetch teacher'))
      );
      fixture.detectChanges();

      const card = fixture.debugElement.query(By.css('mat-card'));
      
      expect(card).toBeNull();
    });

    it('should display the teacher details', () => {
      fixture.detectChanges();

      const teacherElt = fixture.debugElement.query(By.css('[data-testid="sessionTeacherName"]'));

      expect(teacherElt.nativeElement.textContent).toBe(` Jean DUPONT`);
    });

    it('should display the number of attendees', () => {
      fixture.detectChanges();

      const attendeesElt = fixture.debugElement.query(By.css('[data-testid="sessionAttendees"]'));

      expect(attendeesElt.nativeElement.textContent).toBe(` 3 attendees `);
    });

    it('should display the session date', () => {
      fixture.detectChanges();

      const dateElt = fixture.debugElement.query(By.css('[data-testid="sessionDate"]'));
      const date = displayedDate(TEST_SESSION.date as Date);

      expect(dateElt.nativeElement.textContent).toBe(` ${date} `);

    });

    it('should display the delete button for an administrator', () => {
      mockSessionService.sessionInformation.admin = true;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-session-button"]')
      );

      expect(deleteButton).toBeTruthy();
    });

    it('should not display the delete button for an user', () => {
      mockSessionService.sessionInformation.admin = false;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-session-button"]')
      );

      expect(deleteButton).toBeFalsy();
    });

    it('should display the participate button when the user does not participate', () => {
      mockSessionService.sessionInformation.id = 10;
      fixture.detectChanges();

      const participateButton = fixture.debugElement.query(
        By.css('[data-testid="participate-button"]')
      );

      expect(participateButton).toBeTruthy();
    });

    it('should display the do not participate button when the user participates', () => {
      mockSessionService.sessionInformation.id = 1;
      fixture.detectChanges();

      const participateButton = fixture.debugElement.query(
        By.css('[data-testid="participate-button"]')
      );

      expect(participateButton).toBeFalsy();
    });

    it('should call back when clicking the back button', () => {
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(
        By.css('[data-testid="back-button"'));

      backButton.triggerEventHandler('click', null);

      expect(location.back).toHaveBeenCalled();
    });

    it('should call delete when clicking the delete button', () => {
      mockSessionService.sessionInformation.admin = true;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-session-button"')
      );

      deleteButton.triggerEventHandler('click', null);

      expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('123');
    });

    it('should call participate when clicking the participate button', () => {
      mockSessionService.sessionInformation.id = 10;
      mockSessionService.sessionInformation.admin = false;

      fixture.detectChanges();

      const participateButton = fixture.debugElement.query(
        By.css('[data-testid="participate-button"]')
      );

      participateButton.triggerEventHandler('click', null);

      expect(sessionApiServiceMock.participate).toHaveBeenCalledWith('123', '10');
    });

    it('should call unParticipate when clicking the do not participate button', () => {
      mockSessionService.sessionInformation.id = 1;
      fixture.detectChanges();

      const participateButton = fixture.debugElement.query(
        By.css('[data-testid="unparticipate-button"]')
      );

      participateButton.triggerEventHandler('click', null);

      expect(sessionApiServiceMock.unParticipate).toHaveBeenCalledWith('123', '1');
    });

  });
});