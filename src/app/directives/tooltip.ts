import {
  Directive, Input, HostListener,
  ElementRef, Renderer2, OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') texto: string = '';

  private tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.texto) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'app-tooltip');
    this.renderer.setProperty(this.tooltipElement, 'innerText', this.texto);
    this.renderer.appendChild(document.body, this.tooltipElement);

    const rect = this.el.nativeElement.getBoundingClientRect();
    const top = rect.top + window.scrollY - 40;
    const left = rect.left + rect.width / 2;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destruirTooltip();
  }

  ngOnDestroy(): void {
    this.destruirTooltip();
  }

  private destruirTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}