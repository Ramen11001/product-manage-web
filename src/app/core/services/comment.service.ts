import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/app/core/interfaces/comment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = `${environment.baseUrl}/comments`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getCommentsByProduct(productId: number): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.apiUrl}?productId=${productId}`)
      .pipe(catchError(this.handleError));
  }

  createComment(comment: any): Observable<Comment> {
    return this.http
      .post<Comment>(`${this.apiUrl}/comments`, comment, {
        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(
      () => new Error('Ocurrió un error al procesar la solicitud'),
    );
  }
}
