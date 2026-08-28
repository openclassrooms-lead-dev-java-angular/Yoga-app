import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { expect, jest } from '@jest/globals';
import { SessionApiService } from '@core/service/session/session-api.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Session } from '@app/core/models/session.interface';
import { TEST_SESSION } from '@app/test-data/data/test-session';
import { TeacherService } from '@app/core/service/teacher/teacher.service';
import { Teacher } from '@app/core/models/teacher.interface';
import { TEST_TEACHERS } from '@app/test-data/data/test-teacher';
import { By } from '@angular/platform-browser';
import { MatSelect } from '@angular/material/select';


describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;

  let matSnackBarMock: {
    open: jest.Mock;
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn(),
      },
    },
  };

  let sessionApiServiceMock: jest.Mocked<
    Pick<SessionApiService, 'detail' | 'create' | 'update'>
  >;

  let teacherServiceMock: jest.Mocked<
    Pick<TeacherService, 'all'>
  >;


  beforeEach(async () => {
    matSnackBarMock = {
      open: jest.fn(),
    };

    sessionApiServiceMock = {
      detail: jest
        .fn<(id: string) => Observable<Session>>()
        .mockReturnValue(of(TEST_SESSION)),

      create: jest
        .fn<(session: Session) => Observable<Session>>()
        .mockReturnValue(of(TEST_SESSION)),

      update: jest
        .fn<(id: string, session: Session) => Observable<Session>>()
        .mockReturnValue(of(TEST_SESSION)),
    };

    teacherServiceMock = {
      all: jest
        .fn<() => Observable<Teacher[]>>()
        .mockReturnValue(of(TEST_TEACHERS)),
    };

    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        ReactiveFormsModule,
        MatSnackBarModule,
      ],
      providers: [
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
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(FormComponent, {
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

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });


  describe('ngOnInit', () => {

    it('should initialize the component in create mode when no session ID is provided', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      expect(component.onUpdate).toBe(false);
      expect(component.sessionForm).toBeDefined();

      expect(
        activatedRouteMock.snapshot.paramMap.get
      ).toHaveBeenCalledWith('id');

      expect(sessionApiServiceMock.detail).not.toHaveBeenCalled();
    });


    it('should initialize an empty session form in create mode', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        description: '',
        teacher_id: '',
      });
    });


    it('should initialize the component in update mode when a session ID is provided', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');

      component.ngOnInit();

      expect(component.onUpdate).toBe(true);
      expect(component.sessionForm).toBeDefined();

      expect(
        activatedRouteMock.snapshot.paramMap.get
      ).toHaveBeenCalledWith('id');

      expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
    });


    it('should fetch the session when a session ID is provided', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');

      component.ngOnInit();

      expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
      expect(component.sessionForm).toBeDefined();
    });


    it('should initialize the form with the fetched session data', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
      sessionApiServiceMock.detail.mockReturnValue(of(TEST_SESSION));

      component.ngOnInit();

      expect(component.sessionForm?.value).toEqual({
        name: TEST_SESSION.name,
        date: new Date(TEST_SESSION.date)
          .toISOString()
          .split('T')[0],
        teacher_id: TEST_SESSION.teacher_id,
        description: TEST_SESSION.description,
      });
    });


    it('should display an error message when fetching the session fails', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');

      sessionApiServiceMock.detail.mockReturnValue(
        throwError(() => new Error('Unable to fetch session'))
      );

      component.ngOnInit();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to fetch session',
        'Close',
        { duration: 3000 }
      );

      expect(component.sessionForm).toBeUndefined();
    });
  });


  describe('submit', () => {

    describe('create mode', () => {
      const sessionData = {
        name: 'Test Session',
        date: '2022-01-01',
        description: 'Test description',
        teacher_id: '1',
      };

      beforeEach(() => {
        activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

        component.ngOnInit();

        jest.clearAllMocks();
      });


      it('should create a session with the form values', () => {
        component.sessionForm!.setValue(sessionData);

        component.submit();

        expect(sessionApiServiceMock.create).toHaveBeenCalledWith(
          sessionData
        );

        expect(router.navigate).toHaveBeenCalledWith([
          'sessions',
        ]);
      });


      it('should display a success message and navigate to the sessions page when the session is created', () => {
        component.sessionForm!.setValue(sessionData);

        component.submit();

        expect(matSnackBarMock.open).toHaveBeenCalledWith(
          'Session created !',
          'Close',
          { duration: 3000 }
        );

        expect(router.navigate).toHaveBeenCalledWith([
          'sessions',
        ]);
      });
    });


    describe('update mode', () => {
      const updateFormData = {
        name: 'Test Session',
        date: '2022-01-01',
        description: 'Test description',
        teacher_id: '1',
      };

      beforeEach(() => {
        activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');

        component.ngOnInit();

        jest.clearAllMocks();
      });


      it('should update the session with the form values', () => {
        component.sessionForm!.setValue(updateFormData);

        component.submit();

        expect(sessionApiServiceMock.update).toHaveBeenCalledWith(
          '1',
          updateFormData
        );

        expect(router.navigate).toHaveBeenCalledWith([
          'sessions',
        ]);
      });


      it('should display a success message and navigate to the sessions page when the session is updated', () => {
        component.sessionForm!.setValue(updateFormData);

        component.submit();

        expect(matSnackBarMock.open).toHaveBeenCalledWith(
          'Session updated !',
          'Close',
          { duration: 3000 }
        );

        expect(router.navigate).toHaveBeenCalledWith([
          'sessions',
        ]);
      });


      it('should display an error message when updating the session fails', () => {
        sessionApiServiceMock.update.mockReturnValue(
          throwError(() => new Error('Unable to update session'))
        );

        component.submit();

        expect(matSnackBarMock.open).toHaveBeenCalledWith(
          'Unable to update session',
          'Close',
          { duration: 3000 }
        );

        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });


  describe('session form', () => {
    const sessionData = {
      name: 'Test Session',
      date: '2022-01-01',
      description: 'Test description',
      teacher_id: '1',
    };


    it('should initialize the form with empty values in create mode', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      expect(component.sessionForm).toBeDefined();

      expect(component.sessionForm!.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: '',
      });
    });


    it('should initialize the form with the session values in update mode', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
      sessionApiServiceMock.detail.mockReturnValue(of(TEST_SESSION));

      component.ngOnInit();

      expect(component.sessionForm).toBeDefined();

      expect(component.sessionForm!.value).toEqual({
        name: TEST_SESSION.name,
        date: new Date(TEST_SESSION.date)
          .toISOString()
          .split('T')[0],
        teacher_id: TEST_SESSION.teacher_id,
        description: TEST_SESSION.description,
      });
    });


    it('should require the session name', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      const control = component.sessionForm!.get('name');

      control!.setValue('');
      control!.markAsTouched();

      expect(control!.hasError('required')).toBe(true);
    });


    it('should require the session date', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      const control = component.sessionForm!.get('date');

      control!.setValue('');
      control!.markAsTouched();

      expect(control!.hasError('required')).toBe(true);
    });


    it('should require a teacher', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      const control = component.sessionForm!.get('teacher_id');

      control!.setValue('');
      control!.markAsTouched();

      expect(control!.hasError('required')).toBe(true);
    });


    it('should require the session description', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      const control = component.sessionForm!.get('description');

      control!.setValue('');
      control!.markAsTouched();

      expect(control!.hasError('required')).toBe(true);
    });


    it('should reject a description longer than 2000 characters', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      const control = component.sessionForm!.get('description');
      const description = 'a'.repeat(2001);

      control!.setValue(description);

      expect(control!.hasError('maxlength')).toBe(true);
    });


    it('should accept a description of up to 2000 characters', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      const control = component.sessionForm!.get('description');
      const description = 'a'.repeat(2000);

      control!.setValue(description);

      expect(control!.hasError('maxlength')).toBe(false);
    });
  });


  describe('template', () => {

    it('should display "Create session" in create mode', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('h1').textContent
      ).toContain('Create session');
    });


    it('should display "Update session" in update mode', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
      sessionApiServiceMock.detail.mockReturnValue(of(TEST_SESSION));

      component.ngOnInit();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('h1').textContent
      ).toContain('Update session');
    });


    it('should display the session form when the form is initialized', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector('form');

      expect(form).not.toBeNull();
    });


    it('should display the available teachers', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();
      fixture.detectChanges();

      const select = fixture.debugElement.query(
        By.directive(MatSelect)
      );

      expect(select).not.toBeNull();

      const matSelect = select.componentInstance as MatSelect;

      expect(matSelect.options).toHaveLength(
        TEST_TEACHERS.length
      );

      expect(
        matSelect.options.get(0)?.viewValue
      ).toBe('Jean Dupont');

      expect(
        matSelect.options.get(1)?.viewValue
      ).toBe('Sophie Martin');

      expect(
        matSelect.options.get(2)?.viewValue
      ).toBe('Thomas Bernard');
    });


    it('should disable the save button when the form is invalid', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );

      expect(button.disabled).toBe(true);
    });


    it('should enable the save button when the form is valid', () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();
      fixture.detectChanges();

      component.sessionForm!.setValue({
        name: 'Test Session',
        date: '2022-01-01',
        teacher_id: '1',
        description: 'Test description',
      });

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      );

      expect(button.disabled).toBe(false);
    });
  });
});
