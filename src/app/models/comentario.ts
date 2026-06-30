export interface Comentario {
  _id: string;
  publicacion: string;
  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    fotoPerfilUrl?: string;
  };
  mensaje: string;
  modificado: boolean;
  createdAt: string;
}