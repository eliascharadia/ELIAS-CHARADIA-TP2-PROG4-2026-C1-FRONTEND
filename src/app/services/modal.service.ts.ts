import { Injectable, signal } from '@angular/core';

export type TipoModal = 'exito' | 'error' | 'info'

interface EstadoModal {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tipo: TipoModal;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  estado = signal<EstadoModal>({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'info'
  });

  mostrar(mensaje: string, tipo: TipoModal = 'info', titulo?: string) {
    this.estado.set({
      visible: true,
      titulo: titulo ?? this.tituloPorDefecto(tipo),
      mensaje,
      tipo
    });
  }

  cerrar() {
    this.estado.update(s => ({ ...s, visible: false }));
  }

  private tituloPorDefecto(tipo: TipoModal): string {
    switch (tipo) {
      case 'exito': return '¡Listo!';
      case 'error': return 'Ocurrió un error';
      default: return 'Aviso';
    }
  }

}
