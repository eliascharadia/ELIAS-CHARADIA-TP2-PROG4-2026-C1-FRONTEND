import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioAdmin } from '../models/usuarioAdmin';

@Injectable({ providedIn: 'root' })
export class UsuariosAdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  listar() {
    return this.http.get<UsuarioAdmin[]>(`${this.apiUrl}/usuarios`);
  }

  crear(datos: {
    nombre: string;
    apellido: string;
    correo: string;
    nombreUsuario: string;
    password: string;
    repetirPassword: string;
    fechaNacimiento: string;
    descripcion?: string;
    perfil: string;
  }) {
    return this.http.post<UsuarioAdmin>(`${this.apiUrl}/usuarios`, datos);
  }

  deshabilitar(id: string) {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  habilitar(id: string) {
    return this.http.post(`${this.apiUrl}/usuarios/${id}/habilitar`, {});
  }
}