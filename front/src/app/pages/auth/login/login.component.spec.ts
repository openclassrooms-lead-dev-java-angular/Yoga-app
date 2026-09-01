import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SessionService } from '@app/core/service/auth/session.service';
import { AuthService } from '@app/core/service/auth/auth.service';
import { TEST_SESSION_INFORMATION } from '@app/test-data/data/test-auth';
import { LoginRequest } from '@app/core/models/loginRequest.interface';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let sessionService: SessionService;
  let matSnackBarMock: {
    open: jest.Mock;
  };

  beforeEach(async () => {

    matSnackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          }
        },
        {
          provide: SessionService,
          useValue: {
            logIn: jest.fn(),
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          }
        },
        {
          provide: MatSnackBar,
          useValue: matSnackBarMock,
        },
      ],
      imports: [
        LoginComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],

    }).overrideComponent(LoginComponent, {
      set: {
        providers: [
          {
            provide: MatSnackBar,
            useValue: matSnackBarMock,
          },
        ],
      },
    }).compileComponents();

    const snackBar = TestBed.inject(MatSnackBar);
    expect(snackBar).toBe(matSnackBarMock);

    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('form', () => {

    it('should initialize with empty values', () => {
      expect(component.form.value).toEqual({
        email: '',
        password: '',
      });
    });
    describe('email validation', () => {
      it('should require an email', () => {
        const emailControl = component.form.controls.email;
        emailControl.setValue('');
        emailControl.markAsTouched();

        expect(emailControl.hasError('required')).toBe(true);
        expect(emailControl.valid).toBe(false);
      });

      it('should reject an invalid email', () => {
        const emailControl = component.form.controls.email;
        emailControl.setValue('invalid-email');
        emailControl.markAsTouched();

        expect(emailControl.hasError('email')).toBe(true);
        expect(emailControl.valid).toBe(false);
      });

      it('should accept a valid email', () => {
        const emailControl = component.form.controls.email;
        emailControl.setValue('john@example.com');
        emailControl.markAsTouched();

        expect(emailControl.hasError('email')).toBe(false);
        expect(emailControl.valid).toBe(true);
      })
    });

    describe('password validation', () => {

      it('should require a password', () => {
        const passwordControl = component.form.controls.password;
        passwordControl.setValue('');
        passwordControl.markAsTouched();

        expect(passwordControl.hasError('required')).toBe(true);
        expect(passwordControl.valid).toBe(false);
      });

      it('should reject a password shorter than 3 characters', () => {
        const passwordControl = component.form.controls.password;
        passwordControl.setValue('ab');
        passwordControl.markAsTouched();

        expect(passwordControl.hasError('minlength')).toBe(true);
        expect(passwordControl.valid).toBe(false);
      });

    });

    it('should be valid with valid credentials', () => {
      const emailControl = component.form.controls.email;
      const passwordControl = component.form.controls.password;

      emailControl.setValue('john@example.com');
      passwordControl.setValue('password');

      expect(component.form.valid).toBe(true);
    });
  });

  describe('submit', () => {

    it('should login successfully', () => {
      const loginRequest: LoginRequest = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const sessionInformation = TEST_SESSION_INFORMATION;

      jest.spyOn(authService, 'login')
        .mockReturnValue(of(sessionInformation));

      component.form.setValue(loginRequest);
      component.submit();

      expect(authService.login).toHaveBeenCalledWith(loginRequest);
      expect(sessionService.logIn).toHaveBeenCalledWith(TEST_SESSION_INFORMATION);
      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
      expect(component.onError).toBe(false);
    });

    it('should handle login failure', () => {

      const loginRequest: LoginRequest = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login')
        .mockReturnValue(
          throwError(() => new Error('Invalid credentials'))
        );

      component.form.setValue(loginRequest);
      component.submit();

      expect(matSnackBarMock.open).toHaveBeenCalled();
      expect(authService.login).toHaveBeenCalledWith(loginRequest);
      expect(component.onError).toBe(true);
      expect(sessionService.logIn).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

  });

  describe('template', () => {

    it('should disable submit when the form is invalid', () => {
      component.form.setValue({
        email: 'john.doe',
        password: 'pa',
      });

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );

      expect(submitButton.nativeElement.disabled).toBe(true);
    });

    it('should enable submit when the form is valid', () => {
      component.form.setValue({
        email: 'john.doe@example.com',
        password: 'password123',
      });

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('[data-testid="submit-button"]')
      );

      expect(submitButton.nativeElement.disabled).toBe(false);
    });

    it('should display the error message when login fails', () => {
      const loginRequest: LoginRequest = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login')
        .mockReturnValue(
          throwError(() => new Error('Invalid credentials'))
        );

      component.form.setValue(loginRequest);
      component.submit();

      fixture.detectChanges();

      const errorElt = fixture.debugElement.query(By.css('[data-testid="form-error"]'));

      expect(errorElt).toBeTruthy();
      expect(errorElt.nativeElement.textContent.trim()).toBe('An error occurred');
      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to login',
        'Close',
        { duration: 3000 }
      );
    });

    it('should hide the password by default', () => {
      const passwordInput = fixture.debugElement.query(
        By.css('[formControlName="password"]')
      );

      expect(component.hide).toBe(true);
      expect(passwordInput.nativeElement.type).toBe('password');
    });

    it('should toggle password visibility', () => {
      const passwordInput = fixture.debugElement.query(
        By.css('[formControlName="password"]')
      );

      const visibilityButton = fixture.debugElement.query(
        By.css('[data-testid="password-visibility-button"]')
      );

      expect(passwordInput.nativeElement.type).toBe('password');

      visibilityButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.hide).toBe(false);
      expect(passwordInput.nativeElement.type).toBe('text');
    });
  });


  afterEach(() => {
    jest.clearAllMocks();
  });
});
