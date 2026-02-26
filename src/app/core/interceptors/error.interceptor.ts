import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastController = inject(ToastController);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      if (error.status === 401) {
        router.navigate(['/auth/login']);
        errorMessage = 'Sesión expirada. Por favor, inicia sesión de nuevo.';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 500) {
        errorMessage = 'Error del servidor. Inténtalo más tarde.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      // Show toast notification
      toastController.create({
        message: errorMessage,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      }).then(toast => toast.present());

      return throwError(() => error);
    })
  );
};
