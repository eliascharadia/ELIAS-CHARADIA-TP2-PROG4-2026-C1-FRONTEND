import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'registro',
        loadComponent: () =>
            import('./components/registro/registro')
                .then(m => m.Registro)
    },
    {
        path: '',
        loadComponent: () =>
            import('./components/login/login')
                .then(m => m.Login)
    }
];
