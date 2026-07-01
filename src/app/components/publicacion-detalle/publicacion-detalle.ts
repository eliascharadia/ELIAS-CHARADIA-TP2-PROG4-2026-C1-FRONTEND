import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones';
import { Publicacion as PublicacionModel } from '../../models/publicaciones'
import { ComentariosService } from '../../services/comentarios.service.ts';
import { Comentario } from '../../models/comentario';
import { ModalService } from '../../services/modal.service.ts';
import { Publicacion } from '../../components/publicacion/publicacion';
import { Autenticacion } from '../../services/autenticacion';
import { TiempoRelativoPipe } from '../../pipes/tiempo-relativo-pipe';

type PublicacionConLike = PublicacionModel & { yaLeDiLike: boolean };

@Component({
  selector: 'app-publicacion-detalle',
  imports: [CommonModule, RouterModule, FormsModule, Publicacion, TiempoRelativoPipe],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css',
})
export class PublicacionDetalle implements OnInit{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private publicacionesService = inject(PublicacionesService);
  private comentariosService = inject(ComentariosService);
  private modalService = inject(ModalService);
  private authService = inject(Autenticacion);

  publicacionId = '';
  publicacion = signal<PublicacionConLike | null>(null);
  cargandoPublicacion = signal(false);

  comentarios = signal<Comentario[]>([]);
  cargandoComentarios = signal(false);
  hayMasComentarios = signal(true);
  paginaComentarios = 0;
  limiteComentarios = 5;

  nuevoComentario = '';
  enviandoComentario = signal(false);

  comentarioEnEdicionId = signal<string | null>(null);
  textoEdicion = '';
  guardandoEdicion = signal(false);

  esAdminActual = computed(() => this.authService.esAdmin());

  usuarioActualId = computed(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) return null;
    return JSON.parse(usuarioGuardado)._id ?? null;
  });


  ngOnInit(): void {
    this.publicacionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.publicacionId) return;

    this.cargarPublicacion();
    this.cargarComentarios();
  }

  private cargarPublicacion(): void {
    this.cargandoPublicacion.set(true);
    this.publicacionesService.obtenerPorId(this.publicacionId).subscribe({
      next: (datos) => {
        this.publicacion.set(datos);
        this.cargandoPublicacion.set(false);
      },
      error: () => {
        this.cargandoPublicacion.set(false);
        this.modalService.mostrar('No se pudo cargar la publicación.', 'error');
      },
    });
  }

  cargarComentarios(): void {
    this.cargandoComentarios.set(true);
    const offset = this.paginaComentarios * this.limiteComentarios;

    this.comentariosService.listar(this.publicacionId, offset, this.limiteComentarios).subscribe({
      next: (datos) => {
        this.comentarios.update((actuales) => [...actuales, ...datos]);
        this.hayMasComentarios.set(datos.length === this.limiteComentarios);
        this.paginaComentarios++;
        this.cargandoComentarios.set(false);
      },
      error: () => {
        this.cargandoComentarios.set(false);
        this.modalService.mostrar('No se pudieron cargar los comentarios.', 'error');
      },
    });
  }

  onEnviarComentario(): void {
    const mensaje = this.nuevoComentario.trim();
    if (!mensaje) return;

    this.enviandoComentario.set(true);

    this.comentariosService.crear(this.publicacionId, mensaje).subscribe({
      next: (comentarioCreado) => {
        // Lo agregamos al PRINCIPIO de la lista (es el más reciente)
        this.comentarios.update((actuales) => [comentarioCreado, ...actuales]);
        this.nuevoComentario = '';
        this.enviandoComentario.set(false);
      },
      error: (err) => {
        this.enviandoComentario.set(false);
        const mensaje = err.error?.message || 'No se pudo publicar el comentario.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  esMiComentario(comentario: Comentario): boolean {
    return comentario.autor._id === this.usuarioActualId();
  }

  iniciarEdicion(comentario: Comentario): void {
    this.comentarioEnEdicionId.set(comentario._id);
    this.textoEdicion = comentario.mensaje;
  }

  cancelarEdicion(): void {
    this.comentarioEnEdicionId.set(null);
    this.textoEdicion = '';
  }

  guardarEdicion(comentarioId: string): void {
    const mensaje = this.textoEdicion.trim();
    if (!mensaje) return;

    this.guardandoEdicion.set(true);

    this.comentariosService.editar(this.publicacionId, comentarioId, mensaje).subscribe({
      next: (comentarioActualizado) => {
        this.comentarios.update((lista) =>
          lista.map((c) => (c._id === comentarioId ? comentarioActualizado : c))
        );
        this.guardandoEdicion.set(false);
        this.cancelarEdicion();
      },
      error: (err) => {
        this.guardandoEdicion.set(false);
        const mensaje = err.error?.message || 'No se pudo editar el comentario.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  // ---------- Eventos de la card de publicación (like/eliminar) ----------
  onDarLike(publicacionId: string): void {
    this.publicacionesService.darLike(publicacionId).subscribe({
      next: () => this.actualizarLikeLocal(true),
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo dar me gusta.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onQuitarLike(publicacionId: string): void {
    this.publicacionesService.quitarLike(publicacionId).subscribe({
      next: () => this.actualizarLikeLocal(false),
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo quitar el me gusta.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onEliminar(publicacionId: string): void {
    this.publicacionesService.eliminar(publicacionId).subscribe({
      next: () => {
        this.modalService.mostrar('Publicación eliminada correctamente.', 'exito');
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo eliminar la publicación.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  obtenerInicialAutor(nombre: string): string {
    return nombre.charAt(0).toUpperCase() || '?';
  }

  private actualizarLikeLocal(nuevoEstado: boolean): void {
    this.publicacion.update((pub) => {
      if (!pub) return pub;
      return {
        ...pub,
        yaLeDiLike: nuevoEstado,
        cantidadLikes: nuevoEstado ? pub.cantidadLikes + 1 : pub.cantidadLikes - 1,
      };
    });
  }
}
