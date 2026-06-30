import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones';
import { ModalService } from '../../services/modal.service.ts';
import { Publicacion } from '../../components/publicacion/publicacion';
import { Publicacion as PublicacionModel } from '../../models/publicaciones';
import { NuevaPublicacion } from '../nueva-publicacion/nueva-publicacion';
import { Autenticacion } from '../../services/autenticacion';

type PublicacionConLike = PublicacionModel & { yaLeDiLike: boolean };

@Component({
    selector: 'app-publicaciones',
    imports: [CommonModule, Publicacion, NuevaPublicacion],
    templateUrl: './publicaciones.html',
    styleUrl: './publicaciones.css',
})

export class Publicaciones implements OnInit {
    private publicacionesService = inject(PublicacionesService);
    private authService = inject(Autenticacion);
    private modalService = inject(ModalService);

    publicaciones = signal<PublicacionConLike[]>([]);
    cargando = signal(false);
    mostrarModalNuevaPublicacion = signal(false);
    orden = signal<'fecha' | 'likes'>('fecha');
    paginaActual = signal(0);
    limitePorPagina = 3;

    esAdminActual = computed(() => this.authService.esAdmin());

    usuarioActualId = computed(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (!usuarioGuardado) return null;
        return JSON.parse(usuarioGuardado)._id ?? null;
    });

    ngOnInit(): void {
        this.cargarPublicaciones();
    }

    cargarPublicaciones(): void {
        this.cargando.set(true);

        this.publicacionesService.listar({
            orden: this.orden(),
            offset: this.paginaActual() * this.limitePorPagina,
            limit: this.limitePorPagina,
        }).subscribe({
            next: (datos) => {
                this.publicaciones.set(datos as PublicacionConLike[]);
                this.cargando.set(false);
            },
            error: () => {
                this.cargando.set(false);
                this.modalService.mostrar('No se pudieron cargar las publicaciones.', 'error');
            },
        });
    }

    cambiarOrden(nuevoOrden: 'fecha' | 'likes'): void {
        if (this.orden() === nuevoOrden) return;
        this.orden.set(nuevoOrden);
        this.paginaActual.set(0); // al cambiar orden, volvemos a la primera página
        this.cargarPublicaciones();
    }

    paginaSiguiente(): void {
        // Si la última carga trajo menos de "limitePorPagina", asumimos que no hay más
        if (this.publicaciones().length < this.limitePorPagina) return;
        this.paginaActual.update((p) => p + 1);
        this.cargarPublicaciones();
    }

    paginaAnterior(): void {
        if (this.paginaActual() === 0) return;
        this.paginaActual.update((p) => p - 1);
        this.cargarPublicaciones();
    }

    onDarLike(publicacionId: string): void {
        this.publicacionesService.darLike(publicacionId).subscribe({
            next: () => this.actualizarLikeLocal(publicacionId, true),
            error: (err) => {
                this.restaurarBotonLike(publicacionId);
                const mensaje = err.error?.message || 'No se pudo dar me gusta.';
                this.modalService.mostrar(mensaje, 'error');
            },
        });
    }

    onQuitarLike(publicacionId: string): void {
        this.publicacionesService.quitarLike(publicacionId).subscribe({
            next: () => this.actualizarLikeLocal(publicacionId, false),
            error: (err) => {
                this.restaurarBotonLike(publicacionId);
                const mensaje = err.error?.message || 'No se pudo quitar el me gusta.';
                this.modalService.mostrar(mensaje, 'error');
            },
        });
    }

    onEliminar(publicacionId: string): void {
        this.publicacionesService.eliminar(publicacionId).subscribe({
            next: () => {
                this.publicaciones.update((lista) =>
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

    // Actualiza el estado local sin tener que volver a pedir todo el listado al backend
    private actualizarLikeLocal(publicacionId: string, nuevoEstado: boolean): void {
        this.publicaciones.update((lista) =>
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

    // Si el backend rechazó el like/unlike, no actualizamos nada,
    // pero el componente hijo necesita saber que terminó de "procesar" para
    // reactivar el botón. Lo resolvemos recargando el listado actual.
    private restaurarBotonLike(publicacionId: string): void {
        this.cargarPublicaciones();
    }

    

    abrirModalNuevaPublicacion(): void {
        this.mostrarModalNuevaPublicacion.set(true);
    }

    cerrarModalNuevaPublicacion(): void {
        this.mostrarModalNuevaPublicacion.set(false);
    }

    onPublicacionCreada(): void {
        this.paginaActual.set(0);
        this.orden.set('fecha');
        this.cargarPublicaciones(); // recargamos para ver la nueva publicación arriba de todo
    }

}
