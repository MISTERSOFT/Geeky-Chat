import { Pipe, PipeTransform } from '@angular/core';
import * as humanize from 'humanize-duration';

@Pipe({
  name: 'humanize'
})
export class HumanizePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const delta = Date.now() - new Date(value).getTime();
    const options = {
      largest: 2,
      round: true,
      conjunction: ' '
    };
    return humanize(delta, options);
  }
}
