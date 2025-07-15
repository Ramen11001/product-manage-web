// Import necessary modules and interfaces for HTTP requests
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/core/interfaces/product';
import { AuthService } from './auth.service';
import { tokenIntrception } from 'src/app/http-token2.interceptor';
/**
 * Service responsible for handling product-related API requests.
 *
 * @service
 * @class ProductService
 */
@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private authService = inject(AuthService);
  /**
   * Injects the HttpClient service for making HTTP requests.
   * @private
   * @type {HttpClient}
   */
  private http = inject(HttpClient);
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);

    if (error.status === 403) {
      console.error('Acceso denegado - Verifica tus credenciales o permisos');
    }

    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }
  private apiUrl = `${environment.baseUrl}/products`;

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
    // Retrieve authentication token from local storage
    const token = localStorage.getItem('token');
    // Configure authorization headers
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const offset = (currentPage - 1) * limit;
    // Define query parameters for the API request
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
    // Make an HTTP GET request to fetch the products
    return this.http.get<Product[]>(`${environment.baseUrl}/products`, {
      params,
      headers,
    });
  }

  //Obtener todos los productos
  allProduct() {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  //Devuelve los productos por el id
  getProductId(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }


  saveProduct(id: number, productData?: Omit<Product, 'userId'>){
   
    if (id) {
      //Primero, verifico si el user autenticado es el dueño:
      return this.getProductId(id).pipe(
        switchMap(product => {
          const currentUser = this.authService.getCurrentUserId();

          // Caso 1: Usuario no autenticado o token inválido
          if (currentUser === null) {
            return throwError(() => 'Debes iniciar sesión para editar productos');
          }

          // Caso 2: Usuario no es el creador del producto
          if (product.userId !== currentUser) {
            return throwError(() => 'Solo puedes editar tus propios productos');
          }

          // Caso 3: Todo correcto, proceder con la actualización
          return this.http.put<Product>(`${this.apiUrl}/${id}`, productData).pipe(
            catchError(error => throwError(() => 'Error al actualizar el producto'))
          );
        }),
        catchError(error => throwError(() => error))
      );
    }
    else {
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        return throwError(() => new Error('Usuario no autenticado'));
      }
      const fullProductData: Product = {
        ...productData!,
        userId: userId
      };
      return this.http.post<Product>(this.apiUrl, fullProductData)
        .pipe(
          catchError(this.handleError)
        );
    }


  }

  deleteProduct(id: number) {
    if (!id) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    return this.http.delete<Product>(`${this.apiUrl}/${id}`)

  }
}

