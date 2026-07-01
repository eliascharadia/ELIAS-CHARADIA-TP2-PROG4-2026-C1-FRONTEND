import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Autenticacion } from '../../services/autenticacion';
import { SesionService } from '../../services/sesion.service';
import { ClickFueraDirective } from '../../directives/click-fuera';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, ClickFueraDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(Autenticacion);
  private sesionService = inject(SesionService);

  menuAbierto = false;

  cerrarSesion(): void {
    this.sesionService.cerrarSesion();
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    // colapsa el navbar de Bootstrap programáticamente
    const navbar = document.getElementById('navbarContent');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }
}