import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/core/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(
    filterName: string,
    minPrice: number | null,
    maxPrice: number | null,
    currentPage: number,
  ): Observable<Product[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params: any = {
      search: filterName,
     minPrecio: minPrice !== null ? minPrice : undefined,
  maxPrecio: maxPrice !== null ? maxPrice : undefined,
      page: currentPage,
      include: 'comments',
      pagination: 'true',
    };

    return this.http.get<Product[]>(`${environment.baseUrl}/products`, {
      params,
      headers,
    });
  }
}
