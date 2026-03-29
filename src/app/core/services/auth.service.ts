import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  get isAuthenticated$(): Observable<boolean> {
    return this.supabase.user$.pipe(map(user => !!user));
  }

  get currentUser$(): Observable<User | null> {
    return this.supabase.user$;
  }

  get currentUser(): User | null {
    return this.supabase.currentUserValue;
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    const { user, error } = await this.supabase.signIn(
      credentials.email,
      credentials.password
    );

    if (error) {
      return { success: false, error: error.message };
    }

    await this.router.navigate(['/tabs/home']);
    return { success: true };
  }

  async register(credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> {
    const { user, error } = await this.supabase.signUp(
      credentials.email,
      credentials.password,
      credentials.fullName
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  async logout(): Promise<void> {
    await this.supabase.signOut();
    await this.router.navigate(['/auth/login']);
  }

  async getAccessToken(): Promise<string | null> {
    return this.supabase.getAccessToken();
  }
}
