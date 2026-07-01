export interface PublicacionesPorUsuario {
  nombreUsuario: string;
  nombre: string;
  apellido: string;
  cantidad: number;
}

export interface ComentariosPorTiempo {
  fecha: string;
  cantidad: number;
}

export interface ComentariosPorPublicacion {
  titulo: string;
  cantidad: number;
}