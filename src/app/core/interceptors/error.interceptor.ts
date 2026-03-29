import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastController = inject(ToastController);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';
      let shouldShowToast = true;

      // Handle different error status codes
      if (error.status === 0) {
        // Network error or CORS issue
        errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
      } else if (error.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión de nuevo.';
        // logout() clears the session and navigates to /auth/login internally
        authService.logout();
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 429) {
        errorMessage = 'Demasiadas solicitudes. Intenta de nuevo más tarde.';
      } else if (error.status === 500) {
        errorMessage = 'Error del servidor. Inténtalo más tarde.';
      } else if (error.status === 503) {
        errorMessage = 'Servicio no disponible. Estamos trabajando en ello.';
      } else if (error.error?.message) {
        // Only show detailed error messages in development
        errorMessage = environment.production
          ? 'Ha ocurrido un error. Por favor, intenta de nuevo.'
          : error.error.message;
      }

      // Log detailed error in development only
      if (!environment.production) {
        console.error('HTTP Error:', {
          status: error.status,
          message: error.message,
          url: req.url,
          error: error.error
        });
      } else {
        // In production, log minimal info for monitoring
        console.error('HTTP Error:', error.status, req.url);
      }

      // Show toast notification
      if (shouldShowToast) {
        toastController.create({
          message: errorMessage,
          duration: 3000,
          position: 'bottom',
          color: 'danger',
          buttons: [
            {
              text: 'Cerrar',
              role: 'cancel'
            }
          ]
        }).then(toast => toast.present());
      }

      return throwError(() => error);
    })
  );
};
