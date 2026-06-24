export interface UsuarioGuardado {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  descripcion?: string;
  fotoPerfilUrl?: string;
  fechaNacimiento: string;
  perfil: string;
}