import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "@service/auth/session.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private router = inject(Router);
  private sessionService = inject(SessionService);

  public canActivate(): boolean {
    if (!this.sessionService.sessionInformation) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
