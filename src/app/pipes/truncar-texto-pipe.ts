import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncarTexto',
})
export class TruncarTextoPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
