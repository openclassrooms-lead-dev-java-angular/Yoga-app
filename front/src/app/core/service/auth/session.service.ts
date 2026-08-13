import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionInformation } from '@models/sessionInformation.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public sessionInformation: SessionInformation | undefined;
  private isLoggedSubject = new BehaviorSubject<boolean>(false);

  public $isLogged(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  public logIn(user: SessionInformation): void {
    this.sessionInformation = user;
    this.isLoggedSubject.next(true);
  }

  public logOut(): void {
    this.sessionInformation = undefined;
    this.isLoggedSubject.next(false);
  }
}
