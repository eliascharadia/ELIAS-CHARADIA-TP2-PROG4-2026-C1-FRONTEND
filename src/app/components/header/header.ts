import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Autenticacion } from '../../services/autenticacion';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(Autenticacion);
  private sesionService = inject(SesionService);

  cerrarSesion(): void {
    this.sesionService.cerrarSesion();
  }
}