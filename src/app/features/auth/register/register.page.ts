import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  loading = signal(false);

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async register(): Promise<void> {
    // Validation
    if (!this.fullName().trim() || !this.email().trim() || !this.password().trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      const toast = await this.toastController.create({
        message: 'Las contraseñas no coinciden',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    if (this.password().length < 6) {
      const toast = await this.toastController.create({
        message: 'La contraseña debe tener al menos 6 caracteres',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.loading.set(true);

    const result = await this.authService.register({
      fullName: this.fullName(),
      email: this.email(),
      password: this.password()
    });

    this.loading.set(false);

    if (result.success) {
      const toast = await this.toastController.create({
        message: 'Cuenta creada. Revisa tu email para verificar.',
        duration: 3000,
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/auth/login']);
    } else {
      const toast = await this.toastController.create({
        message: result.error || 'Error al crear la cuenta',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
