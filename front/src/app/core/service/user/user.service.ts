import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@models/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly pathService = `${environment.api.users.baseUrl}`;

  private readonly httpClient = inject(HttpClient);

  public getById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.pathService}/${id}`);
  }

  public delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.pathService}/${id}`);
  }
}
