import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Autenticacion } from './autenticacion';

const DIEZ_MINUTOS_MS = 10 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class SesionService {
  private authService = inject(Autenticacion);
  private router = inject(Router);

  private timerId: ReturnType<typeof setTimeout> | null = null;

  mostrarModalExtension = signal(false);
  extendiendoSesion = signal(false);

  iniciarContador(): void {
    this.detenerContador(); // por si había uno corriendo antes
    this.timerId = setTimeout(() => {
      this.mostrarModalExtension.set(true);
    }, DIEZ_MINUTOS_MS);
  }

  detenerContador(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  extenderSesion(): void {
    this.extendiendoSesion.set(true);

    this.authService.refrescar().subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('token', respuesta.token);
        this.extendiendoSesion.set(false);
        this.mostrarModalExtension.set(false);
        this.iniciarContador(); // reiniciamos el ciclo con el token nuevo
      },
      error: () => {
        this.extendiendoSesion.set(false);
        this.cerrarSesion();
      },
    });
  }

  cerrarSesion(): void {
    this.mostrarModalExtension.set(false);
    this.detenerContador();
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }
}