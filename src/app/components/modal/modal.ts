import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service.ts';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  modalService = inject(ModalService);
}
