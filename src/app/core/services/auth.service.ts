import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
/**
 * Authentication service responsible for handling login, logout, and session management.
 *
 * @service
 * @class AuthService
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Base URL for the authentication API, sourced from environment configuration.
   * @type {string}
   * @private
   */
  private baseUrl = environment.baseUrl;
  /**
   * Instance of HttpClient used for making HTTP requests.
   * @type {HttpClient}
   * @private
   */
  private http = inject(HttpClient);
  /**
   * Instance of Router used for navigation between routes.
   * @type {Router}
   * @private
   */
  private router = inject(Router);
  /**
   * Sends login request to the authentication API.
   *
   * @function
   * @param {object} user - Contains username and password for authentication.
   * @returns {Observable<any>} - Returns the server response including authentication token.
   */
  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, user);
  }
  /**
   * Logs out the user by removing the stored token and redirecting to the login page.
   *
   * @function
   */
  logout() {
    localStorage.removeItem('token'); // Delete token
    this.router.navigate(['/login']); // Redirige al usuario a /login
  }
  /**
   * Retrieves the stored authentication token from local storage.
   *
   * @function
   * @returns {string|null} - Returns the token if available, otherwise null.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  /**
   * Determines if the user is authenticated by checking for a valid token.
   *
   * @function
   * @returns {boolean} - Returns `true` if a token exists, otherwise `false`.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Cheek if token exist
  }

}