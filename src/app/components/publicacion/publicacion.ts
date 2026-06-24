import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Publicacion as PublicacionModel } from '../../models/publicaciones';

@Component({
  selector: 'app-publicacion',
  imports: [CommonModule, RouterModule],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  @Input({ required: true }) publicacion!: PublicacionModel & { yaLeDiLike: boolean };
  @Input() usuarioActualId: string | null = null;

  @Output() darLike = new EventEmitter<string>();
  @Output() quitarLike = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  procesandoLike = signal(false);

  get esMiPublicacion(): boolean {
    return this.usuarioActualId !== null && this.publicacion.autor._id === this.usuarioActualId;
  }

  get inicialAutor(): string {
    return this.publicacion.autor.nombre?.charAt(0).toUpperCase() || '?';
  }

  onClickLike(): void {
    if (this.procesandoLike()) return;

    this.procesandoLike.set(true);
    if (this.publicacion.yaLeDiLike) {
      this.quitarLike.emit(this.publicacion._id);
    } else {
      this.darLike.emit(this.publicacion._id);
    }
  }

  onClickEliminar(): void {
    this.eliminar.emit(this.publicacion._id);
  }
}