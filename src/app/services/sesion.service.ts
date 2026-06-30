import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Autenticacion } from './autenticacion';

const MINUTOS_AVISO_PREVIO = 5;

@Injectable({ providedIn: 'root' })
export class SesionService {
  private authService = inject(Autenticacion);
  private router = inject(Router);

  private timerAviso: ReturnType<typeof setTimeout> | null = null;
  private timerExpiracion: ReturnType<typeof setTimeout> | null = null;
  

  mostrarModalExtension = signal(false);
  extendiendoSesion = signal(false);

  iniciarContador(): void {
    this.detenerContador();

    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = this.decodificarToken(token);
    
    if (!payload?.exp) return;
    console.log(payload.exp);
    const ahoraEnSegundos = Math.floor(Date.now() / 1000);
    const segundosHastaExpirar = payload.exp - ahoraEnSegundos;
    console.log(segundosHastaExpirar);
    if (segundosHastaExpirar <= 0) {
      // El token ya está vencido (por ejemplo, el usuario dejó la pestaña
      // abierta mucho tiempo sin actividad)
      this.expirarSesion();
      return;
    }

    // const segundosHastaAviso = segundosHastaExpirar - MINUTOS_AVISO_PREVIO * 60;
    const segundosHastaAviso = segundosHastaExpirar - 10;

    if (segundosHastaAviso > 0) {
      this.timerAviso = setTimeout(() => {
        this.mostrarModalExtension.set(true);
      }, segundosHastaAviso * 1000);
    } else {
      // Ya estamos a menos de 5 minutos de vencer: avisamos ya mismo
      this.mostrarModalExtension.set(true);
    }

    this.timerExpiracion = setTimeout(() => {
      this.expirarSesion();
    }, segundosHastaExpirar * 1000);
  }

  detenerContador(): void {
    if (this.timerAviso) {
      clearTimeout(this.timerAviso);
      this.timerAviso = null;
    }
    if (this.timerExpiracion) {
      clearTimeout(this.timerExpiracion);
      this.timerExpiracion = null;
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

  private expirarSesion(): void {
    this.mostrarModalExtension.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }

  private decodificarToken(token: string): { exp: number } | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }
}