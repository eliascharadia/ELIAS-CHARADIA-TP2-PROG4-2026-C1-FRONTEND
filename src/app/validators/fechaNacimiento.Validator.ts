import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimaEdadValidador( edadMinima: number, edadMaxima: number ): ValidatorFn {

    return (control: AbstractControl ): ValidationErrors | null => {

        if (!control.value) {
            return null;
        }

        const fechaNacimiento = new Date(control.value);
        const fechaActual = new Date();

        if (fechaNacimiento > fechaActual) {
            return { fechaFutura: true };
        }

        let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

        const diferenciaMeses = fechaActual.getMonth() - fechaNacimiento.getMonth();

        if ( diferenciaMeses < 0 || (diferenciaMeses === 0 && fechaActual.getDate() < fechaNacimiento.getDate())){
            edad--;
        }

        if(edad >= edadMaxima){return {superaEdadMaxima: true}}

        return edad >= edadMinima
            ? null
            : { menorEdad: true };
    };
}