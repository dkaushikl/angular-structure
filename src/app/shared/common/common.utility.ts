export class Common {
  IsEmpty(str: string): boolean {
    return str === undefined || str === null || str === '';
  }

  IsNumeric(val) {
    return val !== undefined &&
      val !== '' &&
      val !== '.' &&
      parseFloat(val) !== 0 &&
      val !== null
      ? true
      : false;
  }

  ObjectEmpty(obj: object): boolean {
    return obj == null || obj === undefined || Object.keys(obj).length === 0;
  }

  AddDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  ConvertDateTimeToString(date: Date): string {
    const dateStr = date.toDateString();
    const timeStr =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return dateStr + ' ' + timeStr;
  }

  IsEmptyNumber(str: number): boolean {
    return str === undefined || str === null;
  }

  toFixedCustom(num, upto): number {
    const temp = num.toString();
    num = Number(temp);
    return num.toFixed(upto);
  }

  filterArrObj(arrObj: any, value: string): any {
    const retVal = arrObj.filter(function (el) {
      return (el.Tag === value);
    }).map(function (el) {
      return el.Value;
    });
    return retVal.toString();
  }
}
