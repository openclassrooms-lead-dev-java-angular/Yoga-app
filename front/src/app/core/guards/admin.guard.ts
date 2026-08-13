import { inject, Injectable } from "@angular/core";
import { SessionService } from "../service/auth/session.service";
import { Router, UrlTree } from "@angular/router";


@Injectable({ providedIn: 'root' })
export class AdminGuard {

    private router = inject(Router);
    private sessionService = inject(SessionService);

    public canActivate(): boolean | Promise<boolean> | UrlTree {
        const session = this.sessionService.sessionInformation;

        if (!session) {
            return this.router.createUrlTree(['/login']);
        }

        if (!session.admin) {
            return this.router.createUrlTree(['/sessions']);
        }

        return true;
    }
}