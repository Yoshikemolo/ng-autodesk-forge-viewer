import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/viewer',
    pathMatch: 'full'
  },
  {
    path: 'viewer',
    loadComponent: () => import('./components/forge-viewer/forge-viewer.component').then(m => m.ForgeViewerComponent)
  },
  {
    path: '**',
    redirectTo: '/viewer'
  }
];
