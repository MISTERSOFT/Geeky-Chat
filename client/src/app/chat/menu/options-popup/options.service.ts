import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/http.service';
import { User } from '@shared/models';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OptionsService extends HttpService {
  constructor(private http: HttpClient) {
    super();
  }
  updateProfile(user: User) {
    const body = JSON.stringify(user);
    return this.http.put(`${this.api}/user`, body, this.options)
      .pipe(catchError(this.handleError));
  }
}
