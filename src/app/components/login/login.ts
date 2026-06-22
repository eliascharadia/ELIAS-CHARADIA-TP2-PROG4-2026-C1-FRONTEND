import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { emailOrUsernameValidator } from '../../validators/emailOrUsernameValidator';
import { Autenticacion } from '../../services/autenticacion';
import { ModalService } from '../../services/modal.service.ts';


@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Autenticacion);
  private modalService = inject(ModalService);
  private router = inject(Router);
  cargando = signal(false);

  loginForm = this.fb.group({
    login: ['', [
      Validators.required,
      emailOrUsernameValidator
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
    ]]
  });

  async onSumbit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    const { login, password } = this.loginForm.value;

    this.authService.login(login!, password!).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.authService.guardarSesion(respuesta);
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.cargando.set(false);
        const mensaje = err.error?.message || 'Usuario o contraseña incorrectos.';
        this.modalService.mostrar(mensaje, 'error');
      }
    });
  }
}
