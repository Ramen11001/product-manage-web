import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/core/interfaces/product';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.baseUrl}/products`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);

    if (error.status === 403) {
      console.error('Acceso denegado - Verifica tus credenciales o permisos');
    }

    return throwError(
      () => new Error('Ocurrió un error al procesar la solicitud'),
    );
  }

  /**
   * Fetches products from the backend using search filters and pagination.
   * - Sends an HTTP GET request to the `/products` endpoint.
   * - Includes search filters such as name, price range, and page number.
   * - Includes related comments using the `include` query parameter.
   *
   * @function
   * @param {string} filterName - Product name search filter.
   * @param {number | null} minPrice - Minimum price filter (optional).
   * @param {number | null} maxPrice - Maximum price filter (optional).
   * @param {number} currentPage - Current page number for pagination.
   * @returns {Observable<Product[]>} - Observable containing the list of products.
   */
  getProducts(
    filterName: string,
    minPrice: number | null,
    maxPrice: number | null,
    currentPage: number,
    limit: number,
  ): Observable<Product[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const offset = (currentPage - 1) * limit;
    const params: any = {
      search: filterName,
      minPrecio: minPrice !== null ? minPrice : undefined,
      maxPrecio: maxPrice !== null ? maxPrice : undefined,
      page: currentPage,
      limit: limit,
      offset: offset,
      include: 'comments',
      pagination: 'true',
    };
    return this.http.get<Product[]>(`${environment.baseUrl}/products`, {
      params,
      headers,
    });
  }

  /**
   * Fetches all products without filters or pagination.
   * @returns {Observable<Product[]>} Observable containing all products
   */
  allProduct() {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  /**
   * Gets single product by ID.
   * @param {number} id - Product ID
   * @returns {Observable<Product>} Observable containing requested product
   */
  getProductId(id: number): Observable<Product> {
    //Returns products by id
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates or updates a product.
   * - For updates: Verifies authenticated user owns the product
   * - For creations: Assigns current user as product owner
   *
   * @param {number | null} id - Product ID (null for new products)
   * @param {Omit<Product, 'userId'>} [productData] - Product data (without userId)
   * @returns {Observable<Product>} Observable of saved product
   * @throws {Error} Authentication or ownership errors
   */
  saveProduct(id: number | null, productData?: Omit<Product, 'userId'>) {
    if (id) {
      return this.getProductId(id).pipe(
        switchMap((product) => {
          const currentUser = this.authService.getCurrentUserId();
          if (currentUser === null) {
            return throwError(
              () => 'Debes iniciar sesión para editar productos',
            );
          }
          if (product.userId !== currentUser) {
            return throwError(() => 'Solo puedes editar tus propios productos');
          }
          return this.http
            .put<Product>(`${this.apiUrl}/${id}`, productData)
            .pipe(
              catchError((error) =>
                throwError(() => 'Error al actualizar el producto'),
              ),
            );
        }),
        catchError((error) => throwError(() => error)),
      );
    } else {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return throwError(() => new Error('Usuario no autenticado'));
      }
      const fullProductData: Product = {
        ...productData!,
        userId: userId,
      };
      return this.http
        .post<Product>(this.apiUrl, fullProductData)
        .pipe(catchError(this.handleError));
    }
  }
  /**
   * Deletes product by ID.
   * @param {number} id - Product ID to delete
   * @returns {Observable<Product>} Observable of deleted product
   * @throws {Error} If product ID is not provided
   */
  deleteProduct(id: number) {
    if (!id) {
      return throwError(() => new Error('Producto no encontrado'));
    }
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }
}
