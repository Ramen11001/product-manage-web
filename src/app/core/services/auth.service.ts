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
   * In charge of storing elements of the user model.
   *
   * @function
   */
  saveAuthData(token: string, username: string, userId: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId.toString());
  }
  /**
   * Logs out the user by removing the stored token and redirecting to the login page.
   *
   * @function
   */
  logout() {
    localStorage.removeItem('token'); // Delete token
    localStorage.removeItem('username'); // Delete username
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
   * username from local storage.
   *
   * @function
   * @returns {string|null} - Returns the username if available, otherwise null.
   */
  getUsername(): string | null {
    return localStorage.getItem('username');
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

  /**
   * Retrieves the current user's ID from localStorage.
   * This is more secure than decoding the JWT token on the client side.
   *
   * @function
   * @returns {number | null} - Returns the user ID if available, otherwise null.
   */
  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}
