import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones';
import { ModalService } from '../../services/modal.service.ts';

@Component({
  selector: 'app-nueva-publicacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-publicacion.html',
  styleUrl: './nueva-publicacion.css',
})
export class NuevaPublicacion {
  private fb = inject(FormBuilder);
  private publicacionesService = inject(PublicacionesService);
  private modalService = inject(ModalService);

  @Output() publicacionCreada = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  imagenSeleccionada: File | null = null;
  imagenPrevista = signal<string | null>(null);
  enviando = signal(false);

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.modalService.mostrar('Debés subir un archivo de imagen válido.', 'error');
      return;
    }

    this.imagenSeleccionada = file;

    const reader = new FileReader();
    reader.onload = () => this.imagenPrevista.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPrevista.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const { titulo, descripcion } = this.form.value;

    this.publicacionesService.crear(titulo!, descripcion!, this.imagenSeleccionada).subscribe({
      next: () => {
        this.enviando.set(false);
        this.modalService.mostrar('Tu publicación fue creada con éxito.', 'exito');
        this.publicacionCreada.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        this.enviando.set(false);
        const mensaje = err.error?.message || 'No se pudo crear la publicación.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onClickCerrar(): void {
    this.cerrar.emit();
  }
}