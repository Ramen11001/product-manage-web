import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

//El userid debo cambiarlo. ya que es un parametro obligatorio y no. Debo cambiar que cuando el usuario cree
// el producto se le asigne el id del usuario. Aquí debo meter el userid paraque ya mande todo
interface Product {
  name: string;
  price: number;
  description: string; //No era obligatoria, pero que feo todo. 
  userId: number;

}

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {
  private apiUrl = `${environment.baseUrl}/products`;

  constructor(
    private authService: AuthService,
    private http: HttpClient) {

  }

  createProduct(productData: Omit<Product, 'userId'>): Observable<Product> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }


    const fullProductData: Product = {
      ...productData,
      userId: userId
    };


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`, // Si usas autenticación. Ya se arregló

    });

    return this.http.post<Product>(this.apiUrl, fullProductData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getAuthToken(): string {
    // Obtén el token de donde lo tengas almacenado
    return localStorage.getItem('token') || '';
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);

    if (error.status === 403) {
      console.error('Acceso denegado - Verifica tus credenciales o permisos');
    }

    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }
}