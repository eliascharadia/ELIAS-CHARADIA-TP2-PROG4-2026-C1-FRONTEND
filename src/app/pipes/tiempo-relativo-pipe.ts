import { Pipe, PipeTransform } from '@angular/core';

/*
convierte una fecha a texto relativo ("hace 5 minutos", "hace 2 días")
*/
@Pipe({
  name: 'tiempoRelativo',
  standalone: true,
})
export class TiempoRelativoPipe implements PipeTransform {
  transform(fecha: string | Date): string {

    if (!fecha) return '';

    const ahora = new Date();
    const fechaDate = new Date(fecha);
    const segundos = Math.floor((ahora.getTime() - fechaDate.getTime()) / 1000);

    if (segundos < 60) return 'hace un momento';
    if (segundos < 3600) {
      const minutos = Math.floor(segundos / 60);
      return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    }
    if (segundos < 86400) {
      const horas = Math.floor(segundos / 3600);
      return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
    if (segundos < 2592000) {
      const dias = Math.floor(segundos / 86400);
      return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
    if (segundos < 31536000) {
      const meses = Math.floor(segundos / 2592000);
      return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }

    const años = Math.floor(segundos / 31536000);
    return `hace ${años} ${años === 1 ? 'año' : 'años'}`;
  }
}