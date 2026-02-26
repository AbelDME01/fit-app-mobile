import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);
  private currentSession = new BehaviorSubject<Session | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        }
      }
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession.next(session);
      this.currentUser.next(session?.user ?? null);
    });

    // Check initial session
    this.loadSession();
  }

  private async loadSession(): Promise<void> {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentSession.next(session);
    this.currentUser.next(session?.user ?? null);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get user$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  get session$(): Observable<Session | null> {
    return this.currentSession.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUser.value;
  }

  get currentSessionValue(): Session | null {
    return this.currentSession.value;
  }

  async signUp(email: string, password: string, fullName: string): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      return { user: null, error };
    }

    return { user: data.user, error: null };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    return { user: data.user, error: null };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getAccessToken(): Promise<string | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.access_token ?? null;
  }
}
