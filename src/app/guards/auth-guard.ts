import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Autenticacion } from '../services/autenticacion';
import { SesionService } from '../services/sesion.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Autenticacion);
  const sesionService = inject(SesionService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/']);
    return of(false);
  }

  return authService.autorizar().pipe(
    map(() => {
      sesionService.iniciarContador();
      return true;
    }),
    catchError(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      router.navigate(['/']);
      return of(false);
    })
  );
};