import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { expect, jest } from '@jest/globals';

import { AuthService } from '@app/core/service/auth/auth.service';
import { RegisterComponent } from '@pages/auth/register/register.component';
import { TEST_REGISTER_REQUEST } from '@app/test-data/test-auth';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let authService: AuthService;
  let matSnackBarMock: {
    open: jest.Mock;
  };

  beforeEach(async () => {

    matSnackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          }
        },
        {
          provide: MatSnackBar,
          useValue: matSnackBarMock,
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          }
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('RegisterComponent', () => {

    describe('form', () => {

      it('should initialize the form with empty values', () => {
        expect(component.form.value).toEqual({
          email: '',
          firstName: '',
          lastName: '',
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
        });
      })

      describe('first name validation', () => {

        it('should require a first name', () => {
          const firstNameControl = component.form.controls.firstName;
          firstNameControl.setValue('');
          firstNameControl.markAsTouched();

          expect(firstNameControl.hasError('required')).toBe(true);
          expect(firstNameControl.valid).toBe(false);
        });

        it('should reject a first name shorter than 3 characters', () => {
          const firstNameControl = component.form.controls.firstName;
          firstNameControl.setValue('ab');
          firstNameControl.markAsTouched();

          expect(firstNameControl.hasError('minlength')).toBe(true);
          expect(firstNameControl.valid).toBe(false);
        });

        it('should reject a first name longer than 20 characters', () => {
          const firstNameControl = component.form.controls.firstName;
          firstNameControl.setValue('abc'.repeat(20));
          firstNameControl.markAsTouched();

          expect(firstNameControl.hasError('maxlength')).toBe(true);
          expect(firstNameControl.valid).toBe(false);
        });

        it('should accept a valid first name', () => {
          const firstNameControl = component.form.controls.firstName;
          firstNameControl.setValue('John');
          firstNameControl.markAsTouched();

          expect(firstNameControl.hasError('minlength')).toBe(false);
          expect(firstNameControl.valid).toBe(true);
        });
      });

      describe('last name validation', () => {

        it('should require a last name', () => {
          const lastNameControl = component.form.controls.lastName;
          lastNameControl.setValue('');
          lastNameControl.markAsTouched();

          expect(lastNameControl.hasError('required')).toBe(true);
          expect(lastNameControl.valid).toBe(false);
        });

        it('should reject a last name shorter than 3 characters', () => {
          const lastNameControl = component.form.controls.lastName;
          lastNameControl.setValue('ab');
          lastNameControl.markAsTouched();

          expect(lastNameControl.hasError('minlength')).toBe(true);
          expect(lastNameControl.valid).toBe(false);
        });

        it('should reject a last name longer than 20 characters', () => {
          const lastNameControl = component.form.controls.lastName;
          lastNameControl.setValue('abc'.repeat(20));
          lastNameControl.markAsTouched();

          expect(lastNameControl.hasError('maxlength')).toBe(true);
          expect(lastNameControl.valid).toBe(false);
        });

        it('should accept a valid last name', () => {
          const lastNameControl = component.form.controls.lastName;
          lastNameControl.setValue('Doe');
          lastNameControl.markAsTouched();

          expect(lastNameControl.hasError('minlength')).toBe(false);
          expect(lastNameControl.valid).toBe(true);
        });
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

        it('should reject a password longer than 40 characters', () => {
          const passwordControl = component.form.controls.password;
          passwordControl.setValue('a'.repeat(41));
          passwordControl.markAsTouched();

          expect(passwordControl.hasError('maxlength')).toBe(true);
          expect(passwordControl.valid).toBe(false);
        });

        it('should accept a valid password', () => {
          const passwordControl = component.form.controls.password;
          passwordControl.setValue('password1234');
          passwordControl.markAsTouched();

          expect(passwordControl.hasError('minlength')).toBe(false);
          expect(passwordControl.hasError('maxlength')).toBe(false);
          expect(passwordControl.valid).toBe(true);
        });
      });
    });

    describe('submit', () => {

      it('should register the user and navigate to the login page on success', () => {
        const registerRequest = TEST_REGISTER_REQUEST;
        jest.spyOn(authService, 'register')
          .mockReturnValue(of(undefined));

        component.form.setValue(registerRequest);
        component.submit();

        expect(authService.register).toHaveBeenCalledWith(registerRequest);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(component.onError).toBe(false);
      });

      it('should display an error when registration fails', () => {
        const registerRequest = TEST_REGISTER_REQUEST;
        jest.spyOn(authService, 'register')
          .mockReturnValue(throwError(() => new Error('Registration failed')));

        component.form.setValue(registerRequest);
        component.submit();

        expect(authService.register).toHaveBeenCalledWith(registerRequest);
        expect(component.onError).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should display the registration error in the snackbar', () => {
        const registerRequest = TEST_REGISTER_REQUEST;
        jest.spyOn(authService, 'register')
          .mockReturnValue(throwError(() => new Error('Registration failed')));

        component.form.setValue(registerRequest);
        component.submit();

        expect(authService.register).toHaveBeenCalledWith(registerRequest);
        expect(component.onError).toBe(true);
      });

    });

    describe('template', () => {

      it('should display the error message when registration fails', () => {
        const registerRequest = TEST_REGISTER_REQUEST;
        jest.spyOn(authService, 'register')
          .mockReturnValue(throwError(() => new Error('Registration failed')));

        component.form.setValue(registerRequest);
        component.submit();
        fixture.detectChanges();

        const errorElt = fixture.debugElement.query(By.css('[data-testid="display-error"]'));

        expect(errorElt).toBeTruthy();
        expect(errorElt.nativeElement.textContent).toBe('An error occurred');
      });

    });

  });

});
