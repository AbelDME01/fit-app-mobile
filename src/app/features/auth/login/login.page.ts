import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private authService = inject(AuthService);
  private toastController = inject(ToastController);

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  loading = signal(false);

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async login(): Promise<void> {
    if (!this.email().trim() || !this.password().trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.loading.set(true);

    const result = await this.authService.login({
      email: this.email(),
      password: this.password()
    });

    this.loading.set(false);

    if (!result.success) {
      const toast = await this.toastController.create({
        message: result.error || 'Error al iniciar sesión',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
