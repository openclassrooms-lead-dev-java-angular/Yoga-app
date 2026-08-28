import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { provideRouter, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { SessionService } from './core/service/auth/session.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  let sessionService: {
    $isLogged: jest.Mock;
    logOut: jest.Mock;
  };

  beforeEach(async () => {
    sessionService = {
      $isLogged: jest.fn(),
      logOut: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: SessionService,
          useValue: sessionService,
        },
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('$isLogged', () => {

    it('should return the logged state from SessionService', () => {
      sessionService.$isLogged.mockReturnValue(of(true));

      component.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBe(true);
      });

      expect(sessionService.$isLogged).toHaveBeenCalledTimes(1);
    });

  });

  describe('when user is logged', () => {

    beforeEach(() => {
      sessionService.$isLogged.mockReturnValue(of(true));

      fixture.detectChanges();
    });

    it('should display Sessions link', () => {
      const element = fixture.nativeElement as HTMLElement;

      expect(element.textContent).toContain('Sessions');
    });

    it('should display Account link', () => {
      const element = fixture.nativeElement as HTMLElement;

      expect(element.textContent).toContain('Account');
    });

    it('should display Logout button', () => {
      const element = fixture.nativeElement as HTMLElement;

      const logoutButton = element.querySelector(
        'button'
      );

      expect(logoutButton).not.toBeNull();
      expect(logoutButton?.textContent).toContain('Logout');
    });

    it('should not display Login link', () => {
      const element = fixture.nativeElement as HTMLElement;

      const loginLink = element.querySelector(
        'a[routerLink="/login"]'
      );

      expect(loginLink).toBeNull();
    });

    it('should not display Register link', () => {
      const element = fixture.nativeElement as HTMLElement;

      const registerLink = element.querySelector(
        'a[routerLink="/register"]'
      );

      expect(registerLink).toBeNull();
    });
  });

  describe('when user is not logged', () => {

    beforeEach(() => {
      sessionService.$isLogged.mockReturnValue(of(false));

      fixture.detectChanges();
    });

    it('should display Login link', () => {
      const element = fixture.nativeElement as HTMLElement;

      const loginLink = element.querySelector(
        'a[routerLink="/login"]'
      );

      expect(loginLink).not.toBeNull();
      expect(loginLink?.textContent).toContain('Login');
    });

    it('should display Register link', () => {
      const element = fixture.nativeElement as HTMLElement;

      const registerLink = element.querySelector(
        'a[routerLink="/register"]'
      );

      expect(registerLink).not.toBeNull();
      expect(registerLink?.textContent).toContain('Register');
    });

    it('should not display Sessions link', () => {
      const element = fixture.nativeElement as HTMLElement;

      expect(element.textContent).not.toContain('Sessions');
    });

    it('should not display Account link', () => {
      const element = fixture.nativeElement as HTMLElement;

      expect(element.textContent).not.toContain('Account');
    });

    it('should not display Logout button', () => {
      const element = fixture.nativeElement as HTMLElement;

      const logoutButton = element.querySelector('button');

      expect(logoutButton).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call SessionService.logOut()', () => {
      component.logout();

      expect(sessionService.logOut).toHaveBeenCalledTimes(1);
    });

    it('should logout before navigating', () => {
      const calls: string[] = [];

      sessionService.logOut.mockImplementation(() => {
        calls.push('logout');
      });

      const navigateSpy = jest.spyOn(router, 'navigate');

      component.logout();

      expect(calls).toEqual(['logout']);
      expect(navigateSpy).toHaveBeenCalledWith(['']);
    });
  });
});
