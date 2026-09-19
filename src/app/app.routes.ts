import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-cards/pages/student-card-page/student-card-page.component')
        .then((component) => component.StudentCardPageComponent),
  },
  {
    path: 'certificado',
    loadComponent: () =>
      import('./student-cards/pages/student-certificate-page/student-certificate-page.component')
        .then((component) => component.StudentCertificatePageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
