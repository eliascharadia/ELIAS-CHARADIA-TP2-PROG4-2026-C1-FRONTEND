import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Publicacion as PublicacionModel } from '../../models/publicaciones';

import { TiempoRelativoPipe } from '../../pipes/tiempo-relativo-pipe';
import { TruncarTextoPipe } from '../../pipes/truncar-texto-pipe';
import { InicialPipe } from '../../pipes/inicial-pipe';

@Component({
  selector: 'app-publicacion',
  imports: [CommonModule, RouterModule, TiempoRelativoPipe, TruncarTextoPipe, InicialPipe],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  @Input({ required: true }) publicacion!: PublicacionModel & { yaLeDiLike: boolean };
  @Input() usuarioActualId: string | null = null;
  @Input() esAdmin: boolean = false;

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

  get puedeEliminar(): boolean {
    if (!this.usuarioActualId) return false;
    return this.esAdmin || this.publicacion.autor._id === this.usuarioActualId;
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