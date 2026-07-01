import {
  Directive, ElementRef, EventEmitter,
  HostListener, Output
} from '@angular/core';

@Directive({
  selector: '[appClickFuera]',
  standalone: true,
})
export class ClickFueraDirective {
  @Output() appClickFuera = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    if (!this.el.nativeElement.contains(target)) {
      this.appClickFuera.emit();
    }
  }
}