import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PublicacionesPorUsuario, ComentariosPorTiempo, ComentariosPorPublicacion } from '../models/modelosEstadisticas';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  publicacionesPorUsuario(desde?: string, hasta?: string) {
    return this.http.get<PublicacionesPorUsuario[]>(
      `${this.apiUrl}/estadisticas/publicaciones-por-usuario${this.armarQuery(desde, hasta)}`
    );
  }

  comentariosPorTiempo(desde?: string, hasta?: string) {
    return this.http.get<ComentariosPorTiempo[]>(
      `${this.apiUrl}/estadisticas/comentarios-por-tiempo${this.armarQuery(desde, hasta)}`
    );
  }

  comentariosPorPublicacion(desde?: string, hasta?: string) {
    return this.http.get<ComentariosPorPublicacion[]>(
      `${this.apiUrl}/estadisticas/comentarios-por-publicacion${this.armarQuery(desde, hasta)}`
    );
  }

  private armarQuery(desde?: string, hasta?: string): string {
    const partes: string[] = [];
    if (desde) partes.push(`desde=${desde}`);
    if (hasta) partes.push(`hasta=${hasta}`);
    return partes.length > 0 ? `?${partes.join('&')}` : '';
  }
}