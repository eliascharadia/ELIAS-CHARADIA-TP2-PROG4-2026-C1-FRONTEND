import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface RespuestaLogin {
  token: string;
  usuario: any;
}

@Injectable({
  providedIn: 'root',
})
export class Autenticacion {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Signal central — fuente de verdad del usuario actual
  private _usuarioActual = signal<any | null>(
    this.leerUsuarioDeStorage()
  );

  // Computed públicos para consumir en componentes
  usuarioActual = computed(() => this._usuarioActual());
  esAdmin = computed(() => this._usuarioActual()?.perfil === 'administrador');

  private leerUsuarioDeStorage(): any | null {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  }

  registrar(datos: {
    name: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    repetirPassword: string;
    fechaNacimiento: string;
    descripcion: string;
    imagenPerfil: File | null;
  }) {
    const formData = new FormData();
    formData.append('nombre', datos.name);
    formData.append('apellido', datos.lastName);
    formData.append('correo', datos.email);
    formData.append('nombreUsuario', datos.userName);
    formData.append('password', datos.password);
    formData.append('repetirPassword', datos.repetirPassword);
    formData.append('fechaNacimiento', datos.fechaNacimiento);
    formData.append('descripcion', datos.descripcion);

    if (datos.imagenPerfil) {
      formData.append('fotoPerfil', datos.imagenPerfil);
    }

    return this.http.post(`${this.apiUrl}/autenticacion/registro`, formData);
  }

  login(identificador: string, password: string) {
    return this.http.post<RespuestaLogin>(`${this.apiUrl}/autenticacion/login`, {
      identificador,
      password
    });
  }

  autorizar() {
    return this.http.post(`${this.apiUrl}/autenticacion/autorizar`, {});
  }

  refrescar() {
    return this.http.post(`${this.apiUrl}/autenticacion/refrescar`, {});
  }

  guardarSesion(respuesta: RespuestaLogin) {
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
    this._usuarioActual.set(respuesta.usuario);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._usuarioActual.set(null);
    this.router.navigate(['/']);
  }

  // Metodos para confirmar si es administrador el usuario actual
  obtenerUsuarioActual(): any {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) return null;
    return JSON.parse(usuarioGuardado);
  }
}
