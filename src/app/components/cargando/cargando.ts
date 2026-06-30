import { Component, inject } from '@angular/core';
import { CargandoService } from '../../services/cargando.service';

@Component({
  selector: 'app-cargando',
  imports: [],
  templateUrl: './cargando.html',
  styleUrl: './cargando.css',
})
export class Cargando {
  cargandoService = inject(CargandoService);
}
