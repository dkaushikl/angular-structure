// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'appFilterData'
// })
// export class FilterDataPipe implements PipeTransform {
//   transform(items: any[], value: string): any[] {
//     if (!items || items.length <= 0) {
//       return [];
//     }
//     if (!value) {
//       return items;
//     }

//     if (value === '' || value == null) {
//       return [];
//     }
//     return items.filter(item1 => this.contains(item1, value));
//   }

//   private contains(value: any, filterValue: string): boolean {
//     let object1: any;
//     if (typeof value !== typeof {} && typeof value !== typeof Object) {
//       object1 = { value: value };
//     } else {
//       object1 = value;
//     }

//     for (const key in object1) {
//       if (object1[key] != null) {
//         if (typeof object1[key] === 'object') {
//           if (this.contains(object1[key], filterValue)) {
//             return true;
//           }
//         }
//         if (typeof object1[key] === 'string') {
//           if (object1[key].toLowerCase().toString().indexOf(filterValue.toLowerCase()) > -1) {
//             return true;
//           }
//         }
//         if (object1[key].toString().indexOf(filterValue) > -1) {
//           return true;
//         }
//       }
//     }
//     return false;
//   }
// }
