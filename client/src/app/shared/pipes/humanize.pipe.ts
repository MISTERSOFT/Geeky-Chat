import { Pipe, PipeTransform } from '@angular/core';
import JavascriptTimeAgo from 'javascript-time-ago';
import * as en from 'javascript-time-ago/locale/en'
import * as fr from 'javascript-time-ago/locale/fr'
import { TranslateService } from '../../core/translate.service';

@Pipe({
  name: 'humanize',
  pure: false
})
export class HumanizePipe implements PipeTransform {
  constructor(private translate: TranslateService) { }
  transform(value: any, ...args: any[]): any {
    const timeAgo = new JavascriptTimeAgo(this.translate.lang);
    return timeAgo.format(new Date(value).getTime());
  }
}
