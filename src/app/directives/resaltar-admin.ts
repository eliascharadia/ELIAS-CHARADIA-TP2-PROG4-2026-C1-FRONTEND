import {
  Directive, OnInit, ElementRef,
  Renderer2, inject
} from '@angular/core';
import { Autenticacion } from '../services/autenticacion';

@Directive({
  selector: '[appResaltarAdmin]',
  standalone: true,
})
export class ResaltarAdminDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private authService = inject(Autenticacion);

  ngOnInit(): void {
    if (this.authService.esAdmin()) {
      this.renderer.addClass(this.el.nativeElement, 'modo-admin');
    }
  }
}