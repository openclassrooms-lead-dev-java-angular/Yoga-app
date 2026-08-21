import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { TeacherService } from '@service/teacher/teacher.service';
import { Session } from '@models/session.interface';
import { SessionApiService } from '@service/session/session-api.service';
import { MaterialModule } from "../../../shared/material.module";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form',
  imports: [CommonModule, MaterialModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private matSnackBar = inject(MatSnackBar);
  private sessionApiService = inject(SessionApiService);
  private teacherService = inject(TeacherService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public onUpdate: boolean = false;
  public sessionForm: FormGroup | undefined;
  public teachers$ = this.teacherService.all();
  private id: string | null | undefined;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.onUpdate = true;
      this.sessionApiService
        .detail(this.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (session: Session) => this.initForm(session),
          error: () => this.matSnackBar.open('Unable to fetch session', 'Close', { duration: 3000 }),
        });
    } else {
      this.initForm();
    }
  }

  public submit(): void {
    const session = this.sessionForm?.value as Session;

    if (!this.onUpdate) {
      this.sessionApiService
        .create(session)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.exitPage('Session created !'));
    } else {
      this.sessionApiService
        .update(this.id!, session)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.exitPage('Session updated !'),
          error: () => this.matSnackBar.open('Unable to update session', 'Close', { duration: 3000 }),
        });
    }
  }

  private initForm(session?: Session): void {
    this.sessionForm = this.fb.group({
      name: [
        session ? session.name : '',
        [Validators.required]
      ],
      date: [
        session ? new Date(session.date).toISOString().split('T')[0] : '',
        [Validators.required]
      ],
      teacher_id: [
        session ? session.teacher_id : '',
        [Validators.required]
      ],
      description: [
        session ? session.description : '',
        [
          Validators.required,
          Validators.max(2000)
        ]
      ],
    });
  }

  private exitPage(message: string): void {
    this.matSnackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['sessions']);
  }
}
