/**
 * Development Environment Configuration
 * This file can be committed to git (contains dev/demo credentials only)
 */

export const environment = {
  production: false,

  // Supabase Configuration
  // Replace with your own Supabase project credentials
  supabaseUrl: 'https://gqtxjstuvpqfmbjvbaay.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdHhqc3R1dnBxZm1ianZiYWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjQxMjQsImV4cCI6MjA4NTAwMDEyNH0.6d0ZgJLm5J5zNXY92KsixVIjsJs6-Wa2I7s0B_9lZFg',

  // API Configuration
  apiUrl: 'http://localhost:3000/api',

  // Feature Flags
  enableAnalytics: false,
  enableCrashReporting: false,

  // Security
  enableConsoleLog: true,
  enableDebugMode: true,
};
