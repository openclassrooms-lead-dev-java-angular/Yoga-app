import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { SessionService } from "@service/auth/session.service";

export function JwtInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const sessionService = inject(SessionService);
  if (sessionService.sessionInformation) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionService.sessionInformation!.token}`,
      },
    });
  }
  return next(request);
}
