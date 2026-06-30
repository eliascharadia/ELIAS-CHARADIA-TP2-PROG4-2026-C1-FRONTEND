import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosAdminService } from '../../services/usuarios-admin-service';
import { ModalService } from '../../services/modal.service.ts';
import { UsuarioAdmin } from '../../models/usuarioAdmin';
import { passwordMatchValidator } from '../../validators/confirmPassword.Validator';
import { Autenticacion } from '../../services/autenticacion';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-dashboard-usuarios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css',
})
export class DashboardUsuarios {
  private usuariosService = inject(UsuariosAdminService);
  private modalService = inject(ModalService);
  private authService = inject(Autenticacion);
  private sesionService = inject(SesionService);
  private fb = inject(FormBuilder);

  usuarios = signal<UsuarioAdmin[]>([]);
  cargando = signal(false);
  mostrarModalCrear = signal(false);
  enviando = signal(false)

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    nombreUsuario: ['', Validators.required],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
    ]],
    confirmPassword: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    descripcion: [''],
    perfil: ['usuario', Validators.required],
  },
    {
      validators: passwordMatchValidator
    });


  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuariosService.listar().subscribe({
      next: (datos) => {
        this.usuarios.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.modalService.mostrar('No se pudieron cargar los usuarios.', 'error');
      },
    });
  }


  onCrear(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    const valores = this.form.value;

    this.usuariosService.crear({
      nombre: valores.nombre!,
      apellido: valores.apellido!,
      correo: valores.correo!,
      nombreUsuario: valores.nombreUsuario!,
      password: valores.password!,
      repetirPassword: valores.confirmPassword!,
      fechaNacimiento: valores.fechaNacimiento!,
      descripcion: valores.descripcion || undefined,
      perfil: valores.perfil!,
    }).subscribe({
      next: (nuevoUsuario) => {
        this.usuarios.update((lista) => [...lista, nuevoUsuario]);
        this.enviando.set(false);
        this.mostrarModalCrear.set(false);
        this.form.reset({ perfil: 'usuario' });
        this.modalService.mostrar('Usuario creado correctamente.', 'exito');
      },
      error: (err) => {
        this.enviando.set(false);
        const mensaje = err.error?.message || 'No se pudo crear el usuario.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onDeshabilitar(usuario: UsuarioAdmin): void {
    this.usuariosService.deshabilitar(usuario._id).subscribe({
      next: () => {
        this.usuarios.update((lista) =>
          lista.map((u) => u._id === usuario._id ? { ...u, habilitado: false } : u)
        );
        // Si se deshabilitó a sí mismo, cerrar sesión inmediatamente
        const usuarioActual = this.authService.usuarioActual();
        if (usuarioActual?._id === usuario._id) {
          this.modalService.mostrar(
            'Deshabilitaste tu propia cuenta. Serás redirigido al login.',
            'info'
          );
          setTimeout(() => this.sesionService.cerrarSesion(), 2000);
          return;
        }
        this.modalService.mostrar(`${usuario.nombreUsuario} fue deshabilitado.`, 'info');
      },
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo deshabilitar el usuario.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }

  onHabilitar(usuario: UsuarioAdmin): void {
    this.usuariosService.habilitar(usuario._id).subscribe({
      next: () => {
        this.usuarios.update((lista) =>
          lista.map((u) => u._id === usuario._id ? { ...u, habilitado: true } : u)
        );
        this.modalService.mostrar(`${usuario.nombreUsuario} fue habilitado.`, 'exito');
      },
      error: (err) => {
        const mensaje = err.error?.message || 'No se pudo habilitar el usuario.';
        this.modalService.mostrar(mensaje, 'error');
      },
    });
  }
}
