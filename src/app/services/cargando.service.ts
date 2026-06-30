import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CargandoService {
  visible = signal(false);

  mostrar(): void {
    this.visible.set(true);
  }

  ocultar(): void {
    this.visible.set(false);
  }
}