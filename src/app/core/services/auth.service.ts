import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient)

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, user);
  }

  logout() {
    localStorage.removeItem('token'); // Delete token
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Cheek if token exist
  }
}
//Necesito hacer una función para localStorage, por qué me está haciendo la petición 2 veceses