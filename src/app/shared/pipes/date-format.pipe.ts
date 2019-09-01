import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: string) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'dd-MM-yyyy hh:mm:ss');
    return value;
  }
}
