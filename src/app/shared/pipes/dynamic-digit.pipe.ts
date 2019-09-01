import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDynamicDigit'
})

export class DynamicDigitPipe implements PipeTransform {
  transform(value: number, digit: number) {
    return value !== undefined || value != null
      ? parseFloat(value.toString()).toFixed(digit)
      : value;
  }
}
