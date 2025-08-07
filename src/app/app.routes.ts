import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ProductComponent } from './features/product/product.component';
import { CreateProductComponent } from './features/product-manage/create-product/create-product.component';
import { EditProductComponent } from './features/product-manage/edit-product/edit-product.component';

import { ProductsDetailsComponent } from './features/product-manage/products-details/products-details.component';
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
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  /**
   * Route for the login page.
   * Displays the `LoginComponent` where users can authenticate.
   *
   * @route /login
   * @component LoginComponent
   */
  {
    path: 'login',
    component: LoginComponent,
  },
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
  /**
   * Route for the products Details.
   * Displays the `ProductsDetailsComponent` after successful authentication.
   *
   * @route /productsDetails/:id
   * @component ProductsDetailsComponent
   */
  {
    path: 'productsDetails/:id',
    component: ProductsDetailsComponent,
  },
  /**
   * Route for create a new product.
   * Displays the `CreateProductComponent`.
   *
   * @route /createProduct
   * @component CreateProductComponent
   */
  {
    path: 'createProduct',
    component: CreateProductComponent,
  },
  /**
   * Route for edit a product.
   * Displays the `EditProductComponent`.
   *
   * @route /edit/:id
   * @component EditProductComponent
   */
  {
    path: 'edit/:id',
    component: EditProductComponent,
  },
];
