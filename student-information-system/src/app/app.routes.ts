import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'students',
    loadChildren: () => import('./features/students/students.module').then((m) => m.StudentsModule)
  },
  {
    path: 'overview',
    redirectTo: 'students/overview',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  }
];
