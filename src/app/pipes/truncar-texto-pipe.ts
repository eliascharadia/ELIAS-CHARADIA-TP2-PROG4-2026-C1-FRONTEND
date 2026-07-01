import { Pipe, PipeTransform } from '@angular/core';

/**
 * trunca un texto largo a N caracteres y agrega "...".
 */
@Pipe({
  name: 'truncarTexto',
  standalone: true,
})
export class TruncarTextoPipe implements PipeTransform {
  transform(texto: string, limite: number = 100): string {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite).trimEnd() + '...';
  }
}
