import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroFilterPipe'
})

export class ZeroFilterPipe implements PipeTransform {
  transform(items: any[], flag: boolean): any[] {
    if (!items) {
      return [];
    }
    if (!flag) {
      return items;
    }
    return items.filter(x => x.TotBalance > 0);
  }
}
