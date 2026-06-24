export interface Publicacion {
  _id: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    fotoPerfilUrl?: string;
  };
  activa: boolean;
  createdAt: string;
  cantidadLikes: number;
}

export interface ParametrosListado {
  orden?: 'fecha' | 'likes';
  usuarioId?: string;
  offset?: number;
  limit?: number;
}
