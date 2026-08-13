import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionInformation } from '@models/sessionInformation.interface';
import { LoginRequest } from '@models/loginRequest.interface';
import { SessionService } from '@service/auth/session.service';
import { AuthService } from '@service/auth/auth.service';
import { MaterialModule } from "../../../shared/material.module";

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private sessionService = inject(SessionService);

  public hide = true;
  public onError = false;

  public form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.min(3)
      ]
    ]
  });

  public submit(): void {
    const loginRequest = this.form.value as LoginRequest;
    this.authService.login(loginRequest).subscribe({
      next: (response: SessionInformation) => {
        this.sessionService.logIn(response);
        this.router.navigate(['/sessions']);
      },
      error: () => this.onError = true,
    });
  }
}
