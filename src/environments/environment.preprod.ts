/**
 * Pre-Production Environment Configuration
 *
 * This environment is used for testing before production deployment.
 * - Points to Railway-hosted preprod API
 * - Crash reporting enabled for testing
 * - Console logs disabled
 */

export const environment = {
  production: true,

  // Supabase Configuration
  supabaseUrl: 'https://gqtxjstuvpqfmbjvbaay.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdHhqc3R1dnBxZm1ianZiYWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjQxMjQsImV4cCI6MjA4NTAwMDEyNH0.6d0ZgJLm5J5zNXY92KsixVIjsJs6-Wa2I7s0B_9lZFg',

  // API Configuration - Railway preprod endpoint
  apiUrl: 'https://fitpro-preprod.railway.app/api',

  // Feature Flags
  enableAnalytics: false, // Disable analytics in preprod
  enableCrashReporting: true, // Enable crash reporting for testing

  // Security
  enableConsoleLog: false,
  enableDebugMode: false,
};
