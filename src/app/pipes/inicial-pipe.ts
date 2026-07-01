import { Pipe, PipeTransform } from '@angular/core';
/**
 * extrae la inicial de un nombre.
 */
@Pipe({
  name: 'inicial',
  standalone: true,
})
export class InicialPipe implements PipeTransform {
  transform(nombre: string): string {
    if (!nombre) return '?';
    return nombre.charAt(0).toUpperCase();
  }
}