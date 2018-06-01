import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  protected options: Object;
  protected api: string;

  constructor() {
    this.api = environment.apiUrl;
    this.options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  protected handleError(error) {
    return Observable.throw(error);
  }
}
