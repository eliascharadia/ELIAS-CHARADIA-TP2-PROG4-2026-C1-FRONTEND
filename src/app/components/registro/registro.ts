import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../validators/confirmPassword.Validator';
import { minimaEdadValidador } from '../../validators/fechaNacimiento.Validator';

@Component({
  selector: 'app-registro',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  archivoSeleccionado: File | null = null;
  imagenPrevista = signal<string | null>(null);

  registerForm = this.fb.group({
    name: ['', [
      Validators.required,
    ]],

    lastName: ['', [
      Validators.required,
    ]],

    userName: ['', [
      Validators.required,
    ]],

    email: ['', [
      Validators.required,
      Validators.pattern(/^[^ ]+@[^ ]+\.[a-z]{2,6}$/)
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
    ]],

    confirmPassword: ['', [
      Validators.required
    ]],

    fechaNacimiento: ['', [
      Validators.required,
      minimaEdadValidador(13, 100)
    ]],

    descripcion: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200)
    ]],

    imagenPerfil: [null as File | null, Validators.required]
  },
  {
    validators: passwordMatchValidator
  }
);

  async onSumbit() { 
    
  }

  onArchivoSeleccionado(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      const file = input.files[0];


      if (!file.type.startsWith('image/')) {

        this.registerForm.get('imgagenPerfil')?.setErrors({
          invalidFileType: true
        });

        return;
      }

      this.archivoSeleccionado = file;

      this.registerForm.patchValue({
        imagenPerfil: file
      });

      const reader = new FileReader();

      reader.onload = () => {
        this.imagenPrevista.set(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }
}