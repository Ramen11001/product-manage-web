import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ProductComponent } from './features/product/product.component'
import { CreateProductComponent } from './features/productManage/createProduct/createProduct.component';
import { EditProductComponent } from './features/productManage/edit-product/editproduct.component';
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
   * Route for the product.
   * Displays the `ProductComponent` after successful authentication.
   * Protected by `AuthGuard`, ensuring only authenticated users can access.
   *
   * @route /product
   * @component ProductComponent
   * @canActivate AuthGuard
   */
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [authGuard],
  },
   {
    path: 'createProduct',
    component:  CreateProductComponent,
   
  },
   {
    path: 'edit/:id', 
    component: EditProductComponent
  }
];
