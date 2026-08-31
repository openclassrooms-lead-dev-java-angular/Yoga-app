import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from "@angular/common";
import { Observable } from 'rxjs';
import { SessionService } from '@service/auth/session.service';
import { MaterialModule } from "./shared/material.module";
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MaterialModule, RouterOutlet, RouterModule, FlexLayoutModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private router = inject(Router);
  private sessionService = inject(SessionService);

  public $isLogged(): Observable<boolean> {
    return this.sessionService.$isLogged();
  }

  public logout(): void {
    this.sessionService.logOut();
    this.router.navigate([''])
  }
}
