import { Component, inject } from '@angular/core';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-modal-sesion',
  imports: [],
  templateUrl: './modal-sesion.html',
  styleUrl: './modal-sesion.css',
})
export class ModalSesion {
  sesionService = inject(SesionService);
}
