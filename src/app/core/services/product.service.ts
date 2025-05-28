import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(nombreFiltro: string, minPrecio: number | null, maxPrecio: number | null, paginaActual: number): Observable<{ productos: Producto[], totalPaginas: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const params: any = {
      search: nombreFiltro,
      minPrecio: minPrecio,
      maxPrecio: maxPrecio,
      pagina: paginaActual
    };

    return this.http.get<{ productos: Producto[], totalPaginas: number }>(
      `${environment.baseUrl}/products`, { params, headers }
    );
  }
}
