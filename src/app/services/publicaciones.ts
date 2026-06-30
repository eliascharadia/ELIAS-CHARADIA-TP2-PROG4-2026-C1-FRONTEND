import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Publicacion, ParametrosListado } from '../models/publicaciones';


@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  listar(parametros: ParametrosListado) {
    let query = '';
    const partes: string[] = [];

    if (parametros.orden) partes.push(`orden=${parametros.orden}`);
    if (parametros.usuarioId) partes.push(`usuarioId=${parametros.usuarioId}`);
    if (parametros.offset !== undefined) partes.push(`offset=${parametros.offset}`);
    if (parametros.limit !== undefined) partes.push(`limit=${parametros.limit}`);

    if (partes.length > 0) query = '?' + partes.join('&');

    return this.http.get<Publicacion[]>(`${this.apiUrl}/publicaciones${query}`);
  }

  crear(titulo: string, descripcion: string, imagen: File | null) {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    return this.http.post(`${this.apiUrl}/publicaciones`, formData);
  }

  obtenerPorId(id: string) {
    return this.http.get<Publicacion & { yaLeDiLike: boolean }>(`${this.apiUrl}/publicaciones/${id}`);
  }

  eliminar(id: string) {
    return this.http.delete(`${this.apiUrl}/publicaciones/${id}`);
  }

  darLike(id: string) {
    return this.http.post(`${this.apiUrl}/publicaciones/${id}/like`, {});
  }

  quitarLike(id: string) {
    return this.http.delete(`${this.apiUrl}/publicaciones/${id}/like`);
  }
}
