import { Routes } from '@angular/router';

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
                .then(m => m.Publicaciones)
    },
    {
        path: 'mi-perfil',
        loadComponent: () =>
            import('./components/miperfil/miperfil')
                .then(m => m.Miperfil)
    },
    {
        path: 'publicaciones/:id',
        loadComponent: () =>
            import('./components/publicacion-detalle/publicacion-detalle')
                .then(m => m.PublicacionDetalle)
    },
    { path: '**', redirectTo: '' }
];
