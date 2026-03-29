import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Validators for Form Input Validation
 * Provides additional security and data integrity checks
 */
export class CustomValidators {
  /**
   * Password strength validator
   * Requirements:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && hasMinLength;

      return !passwordValid ? {
        strongPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar,
          hasMinLength
        }
      } : null;
    };
  }

  /**
   * Email validator with stricter rules
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // RFC 5322 compliant email regex (simplified)
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      return emailRegex.test(value) ? null : { email: true };
    };
  }

  /**
   * No XSS patterns validator
   * Prevents common XSS attack patterns
   */
  static noXSS(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Check for common XSS patterns
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i, // Event handlers like onclick=
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /eval\(/i,
      ];

      const hasXSS = xssPatterns.some(pattern => pattern.test(value));

      return hasXSS ? { xss: true } : null;
    };
  }

  /**
   * No SQL injection patterns validator
   */
  static noSQLInjection(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || typeof value !== 'string') {
        return null;
      }

      // Check for common SQL injection patterns
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(--|\#|\/\*|\*\/)/,
        /(\bOR\b\s+\d+\s*=\s*\d+)/i,
        /(\bAND\b\s+\d+\s*=\s*\d+)/i,
        /(union.*select)/i,
      ];

      const hasSQLInjection = sqlPatterns.some(pattern => pattern.test(value));

      return hasSQLInjection ? { sqlInjection: true } : null;
    };
  }

  /**
   * Phone number validator (international format)
   */
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // International phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      return phoneRegex.test(value) ? null : { phoneNumber: true };
    };
  }

  /**
   * URL validator
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      try {
        const url = new URL(value);
        // Only allow http and https protocols
        return ['http:', 'https:'].includes(url.protocol) ? null : { url: true };
      } catch {
        return { url: true };
      }
    };
  }

  /**
   * Match fields validator (e.g., password confirmation)
   */
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;

      if (!value1 || !value2) {
        return null;
      }

      return value1 === value2 ? null : { matchFields: true };
    };
  }

  /**
   * Sanitize input (remove potentially dangerous characters)
   */
  static sanitize(value: string): string {
    if (!value) return value;

    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate file size
   */
  static maxFileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;

      if (!file) {
        return null;
      }

      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes ? null : { maxFileSize: { max: maxSizeInMB, actual: file.size / 1024 / 1024 } };
    };
  }

  /**
   * Validate file type
   */
  static allowedFileTypes(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;

      if (!file) {
        return null;
      }

      const fileType = file.type;
      return allowedTypes.includes(fileType) ? null : { allowedFileTypes: { allowed: allowedTypes, actual: fileType } };
    };
  }
}
