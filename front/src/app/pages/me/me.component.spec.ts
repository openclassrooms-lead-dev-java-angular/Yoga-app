import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';

import { TEST_SESSION_INFORMATION_ADMIN } from '@app/test-data/test-auth';

import { SessionService } from '@app/core/service/auth/session.service';
import { MeComponent } from './me.component';
import { UserService } from '@app/core/service/user/user.service';
import { SessionInformation } from '@app/core/models/sessionInformation.interface';
import { TEST_USER, TEST_USER_ADMIN } from '@app/test-data/test-user';
import { By } from '@angular/platform-browser';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService
  let router: Router;
  let sessionServiceMock: {
    sessionInformation: SessionInformation,
    logOut: jest.Mock
  };
  let matSnackBarMock: {
    open: jest.Mock;
  };
  let location: Location;

  beforeEach(async () => {
    sessionServiceMock = {
      sessionInformation: TEST_SESSION_INFORMATION_ADMIN,
      logOut: jest.fn(),
    };

    matSnackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        MeComponent,
        MatSnackBarModule,
      ],
      providers: [
        {
          provide: SessionService,
          useValue: sessionServiceMock
        },
        {
          provide: UserService,
          useValue: {
            getById: jest.fn().mockReturnValue(of(TEST_USER_ADMIN)),
            delete: jest.fn().mockReturnValue(of(void 0)),
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
          useValue: {
            open: jest.fn(),
          },
        },
        {
          provide: Location,
          useValue: {
            back: jest.fn(),
          },
        },
      ],
    }).overrideComponent(MeComponent, {
      set: {
        providers: [
          {
            provide: MatSnackBar,
            useValue: matSnackBarMock,
          },
        ],
      },
    }).compileComponents();

    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should fetch the current user on initialization', () => {
      jest
        .spyOn(userService, 'getById')
        .mockReturnValue(of(TEST_USER_ADMIN));

      fixture.detectChanges();

      expect(userService.getById).toHaveBeenCalledWith(
        sessionServiceMock.sessionInformation.id.toString()
      );

    });

    it('should set the user when fetching the current user succeeds', () => {
      jest
        .spyOn(userService, 'getById')
        .mockReturnValue(of(TEST_USER_ADMIN));

      fixture.detectChanges();

      expect(component.user).toEqual(TEST_USER_ADMIN);
    });

    it('should display an error message when fetching the current user fails', () => {
      jest
        .spyOn(userService, 'getById')
        .mockReturnValue(
          throwError(() => new Error('Unable to fetch user'))
        );

      fixture.detectChanges();

      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to fetch user',
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

    it('should delete the current user account', () => {
      jest
        .spyOn(userService, 'delete')
        .mockReturnValue(of(void 0));

      component.delete();

      expect(userService.delete).toHaveBeenCalledWith(
        sessionServiceMock.sessionInformation.id.toString()
      );
      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(sessionServiceMock.logOut).toHaveBeenCalled();
    });

    it('should display an error message when deleting the account fails', () => {
      jest
        .spyOn(userService, 'delete')
        .mockReturnValue(
          throwError(() => new Error('Unable to delete account'))
        );

      component.delete();

      expect(userService.delete).toHaveBeenCalledWith(
        sessionServiceMock.sessionInformation.id.toString()
      );
      expect(matSnackBarMock.open).toHaveBeenCalledWith(
        'Unable to delete your account.',
        'Close',
        { duration: 3000 }
      );
    });

  });

  describe('template', () => {

    it('should display the user information', () => {
      fixture.detectChanges();

      const content = fixture.nativeElement.textContent;

      const displayedDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
        }).format(date);
      }
      const createdAt = displayedDate(new Date(TEST_USER_ADMIN.createdAt));
      const updatedAt = displayedDate(new Date(TEST_USER_ADMIN.updatedAt));

      expect(content).toContain(`Name: ${TEST_USER_ADMIN.firstName}`);
      expect(content).toContain(`${TEST_USER_ADMIN.lastName.toUpperCase()}`);
      expect(content).toContain(`Email: ${TEST_USER_ADMIN.email}`);
      expect(content).toContain(`You are admin`);
      expect(content).toContain(`Create at:  ${createdAt}`);
      expect(content).toContain(`Last update:  ${updatedAt}`);
    });

    it('should display the delete account button for a non-administrator', () => {
      jest
        .spyOn(userService, 'getById')
        .mockReturnValue(of(TEST_USER));

      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-user-button"]')
      );

      expect(deleteButton).toBeTruthy();
    });

    it('should not display the delete account button for an administrator', () => {
      jest
        .spyOn(userService, 'getById')
        .mockReturnValue(of(TEST_USER_ADMIN));

      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-user-button"]')
      );

      expect(deleteButton).toBeFalsy();
    });



  });

});
