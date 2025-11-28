import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { RelatorioComponent } from './components/relatorio/relatorio';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'relatorio', component: RelatorioComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];