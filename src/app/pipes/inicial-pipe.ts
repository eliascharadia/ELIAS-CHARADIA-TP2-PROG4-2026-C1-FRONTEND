import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inicial',
})
export class InicialPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
