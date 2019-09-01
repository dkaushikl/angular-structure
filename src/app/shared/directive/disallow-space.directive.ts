// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appDisallowSpaces]'
// })

// export class DisallowSpaceDirective {
//   constructor(private el: ElementRef) { }

//   @HostListener('keydown', ['$event'])
//   onKeyDown(event: KeyboardEvent) {
//       const current: string = this.el.nativeElement.value;
//       if (event.keyCode === 32) {
//           return false;
//       }
//       current.concat(event.key);
//   }
// }
