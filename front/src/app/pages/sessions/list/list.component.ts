import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Observable } from 'rxjs';
import { SessionInformation } from '@models/sessionInformation.interface';
import { Session } from '@models/session.interface';
import { SessionService } from '@service/auth/session.service';
import { SessionApiService } from '@service/session/session-api.service';
import { MaterialModule } from "../../../shared/material.module";

@Component({
  selector: 'app-list',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  private sessionApiService = inject(SessionApiService);
  private sessionService = inject(SessionService);

  public sessions$: Observable<Session[]> = this.sessionApiService.all();

  get user(): SessionInformation | undefined {
    return this.sessionService.sessionInformation;
  }
}
