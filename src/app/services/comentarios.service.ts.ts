import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Comentario } from '../models/comentario';

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  listar(publicacionId: string, offset: number, limit: number) {
    return this.http.get<Comentario[]>(
      `${this.apiUrl}/publicaciones/${publicacionId}/comentarios?offset=${offset}&limit=${limit}`
    );
  }

  crear(publicacionId: string, mensaje: string) {
    return this.http.post<Comentario>(
      `${this.apiUrl}/publicaciones/${publicacionId}/comentarios`,
      { mensaje }
    );
  }

  editar(publicacionId: string, comentarioId: string, mensaje: string) {
    return this.http.put<Comentario>(
      `${this.apiUrl}/publicaciones/${publicacionId}/comentarios/${comentarioId}`,
      { mensaje }
    );
  }
}
