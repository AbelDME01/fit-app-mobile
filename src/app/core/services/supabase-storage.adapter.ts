import { SecureStorageService } from './secure-storage.service';

/**
 * Custom Storage Adapter for Supabase
 * Uses Capacitor Preferences for secure storage on native platforms
 */
export class SupabaseStorageAdapter {
  constructor(private secureStorage: SecureStorageService) {}

  async getItem(key: string): Promise<string | null> {
    return await this.secureStorage.get(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.secureStorage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await this.secureStorage.remove(key);
  }
}
