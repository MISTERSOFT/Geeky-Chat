import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class ShadowService {
  private isVisible = false;
  onShadowVisibilityChanged = new Subject<boolean>();
  constructor() {
    this.onShadowVisibilityChanged.next(this.isVisible);
  }

}
