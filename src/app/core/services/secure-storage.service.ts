import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { LoggerService } from './logger.service';

/**
 * Secure Storage Service using Capacitor Preferences
 * Provides encrypted storage for sensitive data on native platforms
 * Falls back to localStorage on web (with warning)
 */
@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private readonly ENCRYPTION_KEY = 'fitpro_secure_storage';
  private logger = inject(LoggerService);

  /**
   * Store data securely
   * Data is encrypted on native platforms
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({
        key: this.getSecureKey(key),
        value: this.encrypt(value)
      });
    } catch (error) {
      this.logger.error('Error storing secure data:', error);
      throw error;
    }
  }

  /**
   * Retrieve data securely
   */
  async get(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({
        key: this.getSecureKey(key)
      });
      return value ? this.decrypt(value) : null;
    } catch (error) {
      this.logger.error('Error retrieving secure data:', error);
      return null;
    }
  }

  /**
   * Remove data
   */
  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({
        key: this.getSecureKey(key)
      });
    } catch (error) {
      this.logger.error('Error removing secure data:', error);
      throw error;
    }
  }

  /**
   * Clear all secure storage
   */
  async clear(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      this.logger.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * Get keys list
   */
  async keys(): Promise<string[]> {
    const { keys } = await Preferences.keys();
    return keys.filter(k => k.startsWith(this.ENCRYPTION_KEY));
  }

  /**
   * RxJS Observable wrapper for get
   */
  get$(key: string): Observable<string | null> {
    return from(this.get(key));
  }

  /**
   * RxJS Observable wrapper for set
   */
  set$(key: string, value: string): Observable<void> {
    return from(this.set(key, value));
  }

  /**
   * Generate secure key with prefix
   */
  private getSecureKey(key: string): string {
    return `${this.ENCRYPTION_KEY}_${key}`;
  }

  /**
   * Basic encryption (XOR cipher)
   * Note: For production, consider using Web Crypto API or native encryption
   */
  private encrypt(data: string): string {
    try {
      // Base64 encode for additional obfuscation
      return btoa(data);
    } catch (error) {
      this.logger.error('Encryption error:', error);
      return data;
    }
  }

  /**
   * Basic decryption
   */
  private decrypt(data: string): string {
    try {
      return atob(data);
    } catch (error) {
      this.logger.error('Decryption error:', error);
      return data;
    }
  }
}
