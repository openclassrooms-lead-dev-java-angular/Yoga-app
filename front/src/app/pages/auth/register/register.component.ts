import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RegisterRequest } from '@models/registerRequest.interface';
import { AuthService } from '@service/auth/auth.service';
import { MaterialModule } from "../../../shared/material.module";

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public onError = false;
  private readonly destroyRef = inject(DestroyRef);
  private matSnackBar = inject(MatSnackBar);

  public form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40)
      ]
    ]
  });


  public submit(): void {
    const registerRequest = this.form.value as RegisterRequest;
    this.authService.register(registerRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => {
          this.onError = true;
          this.matSnackBar.open('Unable to register', 'Close', { duration: 3000 });
        }
      });
  }

}
