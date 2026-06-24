import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones';
import { ModalService } from '../../services/modal.service.ts';
import { Publicacion } from '../../components/publicacion/publicacion';
import { Publicacion as PublicacionModel } from '../../models/publicaciones';
import { UsuarioGuardado } from '../../models/usuario';

type PublicacionConLike = PublicacionModel & { yaLeDiLike: boolean };

@Component({
  selector: 'app-miperfil',
  imports: [CommonModule, Publicacion],
  templateUrl: './miperfil.html',
  styleUrl: './miperfil.css',
})
export class Miperfil implements OnInit {
  private publicacionesService = inject(PublicacionesService);
  private modalService = inject(ModalService);

  usuario = signal<UsuarioGuardado | null>(null);
  misPublicaciones = signal<PublicacionConLike[]>([]);
  cargandoPublicaciones = signal(false);

  get inicialUsuario(): string {
    return this.usuario()?.nombre?.charAt(0).toUpperCase() || '?';
  }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarMisPublicaciones();
  }

  private cargarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario.set(JSON.parse(usuarioGuardado));
    }
  }

  private cargarMisPublicaciones(): void {
    const usuarioActual = this.usuario();
    const usuarioId = usuarioActual?._id ?? this.obtenerIdDesdeLocalStorage();
    if (!usuarioId) return;

    this.cargandoPublicaciones.set(true);

    this.publicacionesService.listar({
      usuarioId,
      orden: 'fecha',
      limit: 3,
      offset: 0,
    }).subscribe({
      next: (datos) => {
        this.misPublicaciones.set(datos as PublicacionConLike[]);
        this.cargandoPublicaciones.set(false);
      },
      error: () => {
        this.cargandoPublicaciones.set(false);
        this.modalService.mostrar('No se pudieron cargar tus publicaciones.', 'error');
      },
    });
  }

  private obtenerIdDesdeLocalStorage(): string | null {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) return null;
    return JSON.parse(usuarioGuardado)._id ?? null;
  }

  onDarLike(publicacionId: string): void {
    this.publicacionesService.darLike(publicacionId).subscribe({
      next: () => this.actualizarLikeLocal(publicacionId, true),
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo dar me gusta.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onQuitarLike(publicacionId: string): void {
    this.publicacionesService.quitarLike(publicacionId).subscribe({
      next: () => this.actualizarLikeLocal(publicacionId, false),
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo quitar el me gusta.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onEliminar(publicacionId: string): void {
    this.publicacionesService.eliminar(publicacionId).subscribe({
      next: () => {
        this.misPublicaciones.update((lista) =>
          lista.filter((p) => p._id !== publicacionId)
        );
        this.modalService.mostrar('Publicación eliminada correctamente.', 'exito');
      },
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo eliminar la publicación.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  private actualizarLikeLocal(publicacionId: string, nuevoEstado: boolean): void {
    this.misPublicaciones.update((lista) =>
      lista.map((p) => {
        if (p._id !== publicacionId) return p;
        return {
          ...p,
          yaLeDiLike: nuevoEstado,
          cantidadLikes: nuevoEstado ? p.cantidadLikes + 1 : p.cantidadLikes - 1,
        };
      })
    );
  }
}
