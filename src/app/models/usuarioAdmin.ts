export interface UsuarioAdmin {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  perfil: string;
  habilitado: boolean;
  fotoPerfilUrl?: string;
  createdAt: string;
}