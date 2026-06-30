import { Component, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Modal } from './components/modal/modal';
import { Cargando } from './components/cargando/cargando';
import { CargandoService } from './services/cargando.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Modal, Cargando],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ELIAS-CHARADIA-TP2-PROG4-2026-C1-FRONTEND');

   private router = inject(Router);
  private loaderService = inject(CargandoService);

  ngOnInit(): void {
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationStart) {
        this.loaderService.mostrar();
      } else if (
        evento instanceof NavigationEnd ||
        evento instanceof NavigationCancel ||
        evento instanceof NavigationError
      ) {
        this.loaderService.ocultar();
      }
    });
  }
}
