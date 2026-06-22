import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { passwordMatchValidator } from '../../validators/confirmPassword.Validator';
import { minimaEdadValidador } from '../../validators/fechaNacimiento.Validator';
import { ModalService } from '../../services/modal.service.ts';
import { Autenticacion } from '../../services/autenticacion';


@Component({
  selector: 'app-registro',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(Autenticacion);
  private modalService = inject(ModalService);
  private router = inject(Router);

  archivoSeleccionado: File | null = null;
  imagenPrevista = signal<string | null>(null);
  cargando = signal(false);

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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    const valores = this.registerForm.value;

     this.authService.registrar({ // paso los datos del form al servicio
      name: valores.name!,
      lastName: valores.lastName!,
      email: valores.email!,
      userName: valores.userName!,
      password: valores.password!,
      repetirPassword: valores.confirmPassword!,
      fechaNacimiento: valores.fechaNacimiento!,
      descripcion: valores.descripcion!,
      imagenPerfil: this.archivoSeleccionado
    }).subscribe({ // me subscribo
      next: () => {
        this.cargando.set(false);
        this.modalService.mostrar(
          'Tu cuenta fue creada con éxito. Ya podés iniciar sesión.',
          'exito',
          '¡Registro exitoso!'
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.cargando.set(false);
        const mensaje = err.error?.message || 'Ocurrió un error al registrarte.';
        this.modalService.mostrar(mensaje, 'error');
      }
    });
  }

  onArchivoSeleccionado(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      const file = input.files[0];


      if (!file.type.startsWith('image/')) {

        this.registerForm.get('imagenPerfil')?.setErrors({
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