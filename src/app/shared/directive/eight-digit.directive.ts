import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEightDigit]'
})

export class EightDigitDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,8}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'Delete', 'Ctrl', 'ArrowLeft', 'ArrowRight', 'End', 'Home', '-' , 'F12'];
  key;
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.key = event.code;
    if (this.key === 65 && event.ctrlKey) {
      return;
    }
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
        event.preventDefault();
    }
  }
}
