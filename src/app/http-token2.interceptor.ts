import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "./core/services/auth.service";
import { inject } from "@angular/core";

//NO NECITO HACER LOS HEADERS MANUALMENTE
export const tokenIntrception: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const token = authService.getToken();

  // Clonar la solicitud para añadir la cabecera de autenticación
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuar con la solicitud y manejar errores de forma centralizada
  return next(req)
}
