import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from "@angular/common";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, switchMap } from 'rxjs';

import { SessionApiService } from '@service/session/session-api.service';
import { MaterialModule } from "../../../shared/material.module";
import { Session } from '@models/session.interface';
import { SessionService } from '@service/auth/session.service';
import { TeacherService } from '@service/teacher/teacher.service';
import { Teacher } from '@models/teacher.interface';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private sessionApiService = inject(SessionApiService);
  private teacherService = inject(TeacherService);
  private matSnackBar = inject(MatSnackBar);
  private router = inject(Router);
  private location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  public session: Session | undefined;
  public teacher: Teacher | undefined;
  public isParticipate = false;
  public isAdmin = false;
  public sessionId!: string;
  public userId!: string;

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id')!;
    this.isAdmin = this.sessionService.sessionInformation!.admin;
    this.userId = this.sessionService.sessionInformation!.id.toString();

    this.fetchSession();
  }

  public back(): void {
    this.location.back();
  }

  public delete(): void {
    this.sessionApiService
      .delete(this.sessionId)
      .subscribe({
        next: () => {
          this.matSnackBar.open('Session deleted !', 'Close', { duration: 3000 });
          this.router.navigate(['sessions']);
        },
        error: () => this.matSnackBar.open('Unable to delete session', 'Close', { duration: 3000 }),
      });
  }

  public participate(): void {
    this.sessionApiService
      .participate(this.sessionId, this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.fetchSession(),
        error: () => this.matSnackBar.open('Unable to participate', 'Close', { duration: 3000 }),
      });
  }

  public unParticipate(): void {
    this.sessionApiService
      .unParticipate(this.sessionId, this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.fetchSession(),
        error: () => this.matSnackBar.open('Unable to unparticipate', 'Close', { duration: 3000 }),
      });
  }

  private fetchSession(): void {
    this.sessionApiService
      .detail(this.sessionId)
      .pipe(
        switchMap((session: Session): Observable<Teacher> => {
          this.session = session;
          this.isParticipate = session.users.some(
            u => u === this.sessionService.sessionInformation!.id
          )
          return this.teacherService.detail(session.teacher_id.toString());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (teacher: Teacher) => this.teacher = teacher,
        error: () => this.matSnackBar.open('Unable to fetch session', 'Close', { duration: 3000 }),
      });
  }
}
