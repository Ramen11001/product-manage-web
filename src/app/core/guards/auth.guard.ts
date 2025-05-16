import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
/**
 * Guard responsible for controlling access to protected routes.
 * If the user is authenticated, access is granted; otherwise, they are redirected to login.
 *
 * @service
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Initializes AuthGuard with authentication and routing services.
   *
   * @constructor
   * @param {AuthService} authService - Service handling authentication logic.
   * @param {Router} router - Handles navigation between routes.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  /**
   * Determines if the route can be activated based on user authentication.
   * - If the user has a valid token, access is granted.
   * - If not, the user is redirected to the login page.
   *
   * @function
   * @returns {boolean} - Returns `true` if the user is authenticated, otherwise `false`.
   */
  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
