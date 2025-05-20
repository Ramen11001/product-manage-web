import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import {ProductComponent} from './features/product/product.component'
/**
 * Defines the application routes and their associated components.
 *
 * @constant
 * @type {Routes}
 */

export const routes: Routes = [
  /**
   * Redirects the base URL (`/`) to the login page.
   * Ensures a default route is provided when no specific path is entered.
   *
   * @route /
   */
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /**
   * Route for the login page.
   * Displays the `LoginComponent` where users can authenticate.
   *
   * @route /login
   * @component LoginComponent
   */
  { path: 'login', component: LoginComponent },
  /**
   * Route for the dashboard.
   * Displays the `DashboardComponent` after successful authentication.
   * Protected by `AuthGuard`, ensuring only authenticated users can access.
   *
   * @route /dashboard
   * @component DashboardComponent
   * @canActivate AuthGuard
   */
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'product',
    component: ProductComponent
  }
];
