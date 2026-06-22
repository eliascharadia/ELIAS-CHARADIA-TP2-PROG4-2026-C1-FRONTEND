import { Injectable, inject } from '@angular/core';
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

  guardarSesion(respuesta: RespuestaLogin) {
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }
}
