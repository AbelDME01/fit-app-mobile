/**
 * Production Environment Configuration
 *
 * IMPORTANT SECURITY NOTES:
 * - Never commit real credentials to git
 * - Use environment variables in your CI/CD pipeline
 * - Replace these values before building for production
 * - Supabase ANON key is safe to expose (it's public)
 * - Never expose SERVICE_ROLE key in frontend
 */

export const environment = {
  production: true,

  // Supabase Configuration
  supabaseUrl: process.env['SUPABASE_URL'] || 'https://gqtxjstuvpqfmbjvbaay.supabase.co',
  supabaseAnonKey: process.env['SUPABASE_ANON_KEY'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdHhqc3R1dnBxZm1ianZiYWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjQxMjQsImV4cCI6MjA4NTAwMDEyNH0.6d0ZgJLm5J5zNXY92KsixVIjsJs6-Wa2I7s0B_9lZFg',

  // API Configuration
  apiUrl: process.env['API_URL'] || 'https://api.fitpro.app/api',

  // Feature Flags
  enableAnalytics: true,
  enableCrashReporting: true,

  // Security
  enableConsoleLog: false,
  enableDebugMode: false,
};
