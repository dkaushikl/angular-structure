// import { Directive, ElementRef, Renderer, Input, OnInit } from '@angular/core';

// @Directive({ selector: '[appSortHeader]' })
// export class SortDirective implements OnInit {
//   @Input() data: any[];
//   // tslint:disable-next-line:no-input-rename
//   @Input('sortKey') key: any;
//   private toggleSort = false;

//   constructor(private el: ElementRef, private renderer: Renderer) {}

//   ngOnInit() {
//     this.renderer.listen(this.el.nativeElement, 'click', event => {
//       const parentNode = this.el.nativeElement.parentNode;
//       const children = parentNode.children;

//       if (this.data && this.key) {
//         const sortedData: any = this.sortArray();
//       }
//       this.toggleSort = !this.toggleSort;
//     });
//   }

//   sortArray(): Array<any> {
//     const tempArray: Array<any> = this.data;
//     tempArray.sort((a, b) => {
//       const aKey = a[this.key];
//       const str1: string = a[this.key];
//       const str2: string = b[this.key];
//       if (this.toggleSort) {
//         if (str1 < str2) {
//           return -1;
//         }
//         if (str1 > str2) {
//           return 1;
//         }
//       } else {
//         if (str1 > str2) {
//           return -1;
//         }
//         if (str1 < str2) {
//           return 1;
//         }
//       }
//       return 0;
//     });
//     return tempArray;
//   }
// }
