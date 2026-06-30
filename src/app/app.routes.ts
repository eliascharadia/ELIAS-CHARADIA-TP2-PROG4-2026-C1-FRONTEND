import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/login/login')
                .then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () =>
            import('./components/registro/registro')
                .then(m => m.Registro)
    },
    {
        path: 'publicaciones',
        loadComponent: () =>
            import('./components/publicaciones/publicaciones')
                .then(m => m.Publicaciones),
        canActivate: [authGuard]
    },
    {
        path: 'mi-perfil',
        loadComponent: () =>
            import('./components/miperfil/miperfil')
                .then(m => m.Miperfil),
        canActivate: [authGuard]
    },
    {
        path: 'publicaciones/:id',
        loadComponent: () =>
            import('./components/publicacion-detalle/publicacion-detalle')
                .then(m => m.PublicacionDetalle),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard/usuarios',
        loadComponent: () =>
            import('./components/dashboard-usuarios/dashboard-usuarios')
                .then(m => m.DashboardUsuarios),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard/estadisticas',
        loadComponent: () =>
            import('./components/dashboard-estadisticas/dashboard-estadisticas')
                .then(m => m.DashboardEstadisticas),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '' }
];
