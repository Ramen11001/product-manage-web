// Import necessary modules and interfaces for HTTP requests
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/core/interfaces/product';

/**
 * Service responsible for handling product-related API requests.
 *
 * @service
 * @class ProductService
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  /**
   * Injects the HttpClient service for making HTTP requests.
   * @private
   * @type {HttpClient}
   */
  private http = inject(HttpClient);
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
}
