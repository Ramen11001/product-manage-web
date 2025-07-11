import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface Product {
  productName: string;
  price: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {
  private apiUrl = `${environment.baseUrl}/products`;

  constructor(private http: HttpClient) {}

  createProduct(productData: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Si usas autenticación
    });

    return this.http.post<Product>(this.apiUrl, productData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getAuthToken(): string {
    // Obtén el token de donde lo tengas almacenado
    return localStorage.getItem('auth_token') || '';
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    
    if (error.status === 403) {
      console.error('Acceso denegado - Verifica tus credenciales o permisos');
    }
    
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }
}