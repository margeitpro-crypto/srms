const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

/**
 * Helper utilities for the SRMS backend
 */
class Helpers {
  /**
   * Generate a random string of specified length
   */
  static generateRandomString(length = 10) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Generate a secure random password
   */
  static generatePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password, rounds = 12) {
    return await bcrypt.hash(password, rounds);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn,
      issuer: 'SRMS',
      audience: 'SRMS-Users'
    });
  }

  /**
   * Verify JWT token
   */
  static async verifyToken(token) {
    const verify = promisify(jwt.verify);
    return await verify(token, process.env.JWT_SECRET || 'fallback-secret');
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (Nepal format)
   */
  static isValidPhone(phone) {
    const phoneRegex = /^(\+977)?[98]\d{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  }

  /**
   * Format phone number
   */
  static formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return `+977-${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('977')) {
      return `+${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }

    return phone;
  }

  /**
   * Calculate age from date of birth
   */
  static calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Format date for display
   */
  static formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);

    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD HH:mm:ss':
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      case 'DD MMM YYYY':
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${monthNames[d.getMonth()]} ${year}`;
      default:
        return d.toISOString();
    }
  }

  /**
   * Convert Nepali date to English (basic conversion)
   */
  static nepaliToEnglishDate(nepaliDate) {
    // This is a simplified conversion - in production, use a proper Nepali calendar library
    const [year, month, day] = nepaliDate.split('-').map(Number);
    const englishYear = year - 57; // Approximate conversion
    return new Date(englishYear, month - 1, day);
  }

  /**
   * Paginate results
   */
  static paginate(page = 1, limit = 10) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page

    return {
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      page: pageNum,
      limit: limitNum
    };
  }

  /**
   * Calculate pagination metadata
   */
  static getPaginationMeta(page, limit, total) {
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      currentPage,
      itemsPerPage,
      totalItems: total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      previousPage: currentPage > 1 ? currentPage - 1 : null
    };
  }

  /**
   * Slugify string for URLs
   */
  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  /**
   * Deep clone an object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Remove sensitive fields from objects
   */
  static removeSensitiveFields(obj, fields = ['password', 'token', 'secret']) {
    const cleaned = this.deepClone(obj);

    const removeFields = (object) => {
      if (Array.isArray(object)) {
        return object.map(item => removeFields(item));
      } else if (object !== null && typeof object === 'object') {
        const result = {};
        for (const key in object) {
          if (object.hasOwnProperty(key) && !fields.includes(key.toLowerCase())) {
            result[key] = removeFields(object[key]);
          }
        }
        return result;
      }
      return object;
    };

    return removeFields(cleaned);
  }

  /**
   * Generate file name with timestamp
   */
  static generateFileName(originalName, prefix = '') {
    const timestamp = Date.now();
    const random = this.generateRandomString(6);
    const extension = originalName.split('.').pop();
    const name = originalName.split('.').slice(0, -1).join('.');
    const safeName = this.slugify(name);

    return `${prefix}${prefix ? '_' : ''}${safeName}_${timestamp}_${random}.${extension}`;
  }

  /**
   * Format file size in human readable format
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Escape HTML to prevent XSS
   */
  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generate OTP
   */
  static generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
  }

  /**
   * Mask sensitive information
   */
  static maskSensitiveInfo(value, type = 'default') {
    if (!value) return value;

    switch (type) {
      case 'email':
        const [localPart, domain] = value.split('@');
        if (localPart.length <= 2) return value;
        return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}@${domain}`;

      case 'phone':
        if (value.length < 4) return value;
        return `${'*'.repeat(value.length - 4)}${value.slice(-4)}`;

      case 'name':
        if (value.length <= 2) return value;
        return `${value[0]}${'*'.repeat(value.length - 2)}${value[value.length - 1]}`;

      default:
        if (value.length <= 4) return value;
        return `${'*'.repeat(value.length - 4)}${value.slice(-4)}`;
    }
  }

  /**
   * Validate and sanitize roll number
   */
  static sanitizeRollNumber(rollNo) {
    return rollNo.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  /**
   * Generate student ID card number
   */
  static generateStudentId(schoolCode, year, rollNo) {
    const yearSuffix = year.toString().slice(-2);
    const paddedRoll = rollNo.toString().padStart(3, '0');
    return `${schoolCode}${yearSuffix}${paddedRoll}`;
  }

  /**
   * Calculate percentage
   */
  static calculatePercentage(obtained, total, decimals = 2) {
    if (total === 0) return 0;
    return parseFloat(((obtained / total) * 100).toFixed(decimals));
  }

  /**
   * Check if date is in valid academic year
   */
  static isValidAcademicYear(date) {
    const currentYear = new Date().getFullYear();
    const inputYear = new Date(date).getFullYear();

    // Allow dates within 5 years before and 1 year after current year
    return inputYear >= (currentYear - 5) && inputYear <= (currentYear + 1);
  }

  /**
   * Get current academic year
   */
  static getCurrentAcademicYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based (0 = January)

    // Academic year starts in April (month 3)
    if (month >= 3) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  }

  /**
   * Convert string to title case
   */
  static toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Debounce function
   */
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Sleep/delay function
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (i === maxRetries) {
          break;
        }

        const delay = baseDelay * Math.pow(2, i);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Check if value is empty (null, undefined, empty string, empty array, empty object)
   */
  static isEmpty(value) {
    if (value == null) return true;
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Get nested property from object safely
   */
  static get(obj, path, defaultValue = undefined) {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }

    return result !== undefined ? result : defaultValue;
  }

  /**
   * Set nested property in object
   */
  static set(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return obj;
  }
}

module.exports = Helpers;
