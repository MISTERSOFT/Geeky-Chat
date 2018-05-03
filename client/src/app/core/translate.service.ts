import { Injectable } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-store';
import JavascriptTimeAgo from 'javascript-time-ago';
import * as en from 'javascript-time-ago/locale/en'
import * as fr from 'javascript-time-ago/locale/fr'

@Injectable()
export class TranslateService {
  @LocalStorage('lang')
  private _language: string = 'en-US';
  constructor(private localeStorageSvc: LocalStorageService) {
    JavascriptTimeAgo.locale(this.humanizeLangObj);
  }
  get lang() {
    return this._language;
  }
  set lang(_lang: string) {
    this._language = _lang;
    this.localeStorageSvc.set('lang', this._language);
    JavascriptTimeAgo.locale(this.humanizeLangObj);
  }

  get humanizeLangObj() {
    switch (this.lang) {
      case 'en-US': return en;
      case 'fr-FR': return fr;
      default: return 'en-US';
    }
  }
}
