import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class productService {
  private apiUrl = `${environment.baseUrl}/product`;

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  
    updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    // Verificar primero si el usuario es el propietario
    return this.getProduct(id).pipe(
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
        return this.http.put<Product>(`${this.apiUrl}/${id}`, data).pipe(
          catchError(error => throwError(() => 'Error al actualizar el producto'))
        );
      }),
      catchError(error => throwError(() => error))
    );
  }

}