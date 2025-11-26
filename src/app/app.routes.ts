import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductComponent } from './components/product/product';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'produtos', component: ProductComponent },
  { path: 'relatorio', component: HomeComponent }, 
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];