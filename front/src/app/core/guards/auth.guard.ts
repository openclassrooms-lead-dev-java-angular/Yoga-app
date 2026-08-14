import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { SessionService } from "@service/auth/session.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private router = inject(Router);
  private sessionService = inject(SessionService);

  public canActivate(): boolean | UrlTree {
    return this.sessionService.sessionInformation
      ? true
      : this.router.createUrlTree(['login']);
  }
}
