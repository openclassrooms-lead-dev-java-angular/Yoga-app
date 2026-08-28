import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, jest } from '@jest/globals';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { ListComponent } from './list.component';
import { SessionInformation } from '@app/core/models/sessionInformation.interface';
import { Session } from '@app/core/models/session.interface';
import { TEST_SESSIONS } from '@app/test-data/data/test-session';
import { TEST_SESSION_INFORMATION, TEST_SESSION_INFORMATION_ADMIN } from '@app/test-data/data/test-auth';
import { SessionService } from '@app/core/service/auth/session.service';
import { SessionApiService } from '@app/core/service/session/session-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  let matSnackBarMock: {
    open: jest.Mock;
  };

  let sessionApiService: {
    all: jest.Mock;
  };

  let sessionService: {
    sessionInformation: SessionInformation | undefined;
  };

  const sessions: Session[] = TEST_SESSIONS;

  const adminUser: SessionInformation = TEST_SESSION_INFORMATION_ADMIN;

  const regularUser: SessionInformation = TEST_SESSION_INFORMATION;

  beforeEach(async () => {
    sessionApiService = {
      all: jest.fn().mockReturnValue(of(sessions)),
    };

    sessionService = {
      sessionInformation: regularUser,
    };

    matSnackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        {
          provide: SessionApiService,
          useValue: sessionApiService,
        },
        {
          provide: SessionService,
          useValue: sessionService,
        },
        provideRouter([]),
      ],
    })
      .overrideComponent(ListComponent, {
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

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SessionApiService.all()', () => {
    expect(sessionApiService.all).toHaveBeenCalledTimes(1);
  });

  it('should return the current user', () => {
    expect(component.user).toEqual(regularUser);
  });

  it('should display all sessions titles and dates', () => {
    const element = fixture.nativeElement as HTMLElement;

    console.log(element.textContent);
    expect(element.textContent).toContain('Session de yoga débutant');
    expect(element.textContent).toContain('Une session de yoga pour débutants');
    expect(element.textContent).toContain('Session destinée aux pratiquants confirmés');
    expect(element.textContent).toContain('Session axée sur la relaxation et la respiration');

    expect(element.textContent).toContain('September 15, 2026');
    expect(element.textContent).toContain('September 16, 2026');
    expect(element.textContent).toContain('September 17, 2026');
  });

  it('should display one card per session', () => {
    const cards = fixture.nativeElement.querySelectorAll('.item');

    expect(cards.length).toBe(3);
  });

  it('should display Detail button for each session', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      '.item mat-card-actions button'
    );

    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain('Detail');
    expect(buttons[1].textContent).toContain('Detail');
  });

  it('should display Create button when user is admin', () => {
    sessionService.sessionInformation = adminUser;

    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );

    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('Create');
  });

  it('should not display Create button when user is not admin', () => {
    sessionService.sessionInformation = regularUser;

    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );

    expect(createButton).toBeNull();
  });

  it('should display Edit button for each session when user is admin', () => {
    sessionService.sessionInformation = adminUser;

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-testid="edit-session-button"]'));

    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain('Edit');
  });

  it('should not display Edit buttons when user is not admin', () => {
    sessionService.sessionInformation = regularUser;

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).not.toContain('Edit');

    const buttons = element.querySelectorAll(
      '.item mat-card-actions button'
    );

    expect(buttons.length).toBe(3);
  });
});