import { apiHelpers, API_ENDPOINTS } from '../api/config';

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
class AuthService {
  constructor() {
    this.tokenKey = 'authToken';
    this.userKey = 'user';
    this.refreshTokenKey = 'refreshToken';
  }

  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      const response = await apiHelpers.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.token && response.user) {
        this.setAuthData(response.token, response.user, response.refreshToken);
        return {
          success: true,
          user: response.user,
          message: response.message,
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await apiHelpers.post(API_ENDPOINTS.AUTH.REGISTER, userData);

      if (response.token && response.user) {
        this.setAuthData(response.token, response.user, response.refreshToken);
        return {
          success: true,
          user: response.user,
          message: response.message,
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate server-side session
      await apiHelpers.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error.message);
    } finally {
      // Always clear local storage
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const response = await apiHelpers.get(API_ENDPOINTS.AUTH.PROFILE);

      if (response.user) {
        // Update stored user data
        this.setUser(response.user);
        return {
          success: true,
          user: response.user,
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch profile',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await apiHelpers.put(API_ENDPOINTS.AUTH.PROFILE, profileData);

      if (response.user) {
        this.setUser(response.user);
        return {
          success: true,
          user: response.user,
          message: response.message,
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Profile update failed',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiHelpers.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Password change failed',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        this.clearAuthData();
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Invalid token format:', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Get stored auth token
   */
  getToken() {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  getUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken() {
    try {
      return localStorage.getItem(this.refreshTokenKey);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  }

  /**
   * Set authentication data
   */
  setAuthData(token, user, refreshToken = null) {
    try {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));

      if (refreshToken) {
        localStorage.setItem(this.refreshTokenKey, refreshToken);
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  /**
   * Update stored user data
   */
  setUser(user) {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.refreshTokenKey);
    } catch (error) {
      console.warn('Error clearing auth data:', error);
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    const user = this.getUser();
    if (!user || !user.role || !role) return false;
    return user.role.toLowerCase() === role.toLowerCase();
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles) {
    const user = this.getUser();
    return user && roles.map(role => role.toLowerCase()).includes(user.role.toLowerCase());
  }

  /**
   * Check if user has permission for specific action
   */
  hasPermission(action) {
    const user = this.getUser();
    if (!user) return false;

    // Define role-based permissions
    const permissions = {
      super_admin: ['*'], // All permissions
      district_admin: [
        'view_all_schools',
        'manage_schools',
        'view_all_students',
        'manage_students',
        'view_all_marks',
        'manage_marks',
        'view_reports',
        'manage_users',
      ],
      school_admin: [
        'view_own_school',
        'manage_own_students',
        'view_own_marks',
        'manage_own_marks',
        'view_own_reports',
        'manage_teachers',
      ],
      teacher: [
        'view_assigned_classes',
        'manage_assigned_marks',
        'view_assigned_reports',
      ],
      student: [
        'view_own_marks',
        'view_own_reports',
      ],
      parent: [
        'view_child_marks',
        'view_child_reports',
      ],
    };

    const userRole = user.role?.toLowerCase();
    const userPermissions = permissions[userRole] || [];

    // Super admin has all permissions
    if (userPermissions.includes('*')) {
      return true;
    }

    return userPermissions.includes(action);
  }

  /**
   * Get user role display name
   */
  getRoleDisplayName(role = null) {
    const userRole = (role || this.getUser()?.role)?.toLowerCase();

    const roleNames = {
      super_admin: 'Super Administrator',
      district_admin: 'District Administrator',
      school_admin: 'School Administrator',
      teacher: 'Teacher',
      student: 'Student',
      parent: 'Parent',
    };

    return roleNames[userRole] || 'Unknown';
  }

  /**
   * Check if token needs refresh (expires in less than 5 minutes)
   */
  needsTokenRefresh() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;

      // Refresh if token expires in less than 5 minutes (300 seconds)
      return timeUntilExpiry < 300;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiHelpers.post('/auth/refresh', {
        refreshToken,
      });

      if (response.token) {
        const currentUser = this.getUser();
        this.setAuthData(response.token, currentUser, response.refreshToken);
        return true;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      // If refresh fails, clear auth data and redirect to login
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Initialize auth service
   * Check token validity on app start
   */
  init() {
    // Check if user is authenticated on service initialization
    if (this.isAuthenticated() && this.needsTokenRefresh()) {
      // Attempt to refresh token silently
      this.refreshToken().catch(() => {
        // If refresh fails, user will be redirected to login
        console.warn('Token refresh failed on init');
      });
    }
  }

  /**
   * Get auth headers for manual API calls
   */
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback) {
    // Simple implementation - in a real app, you might use a more sophisticated observer pattern
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'authToken' || key === 'user') {
        callback(authService.isAuthenticated(), authService.getUser());
      }
    };

    localStorage.removeItem = function(key) {
      originalRemoveItem.apply(this, arguments);
      if (key === 'authToken' || key === 'user') {
        callback(authService.isAuthenticated(), authService.getUser());
      }
    };
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;

// Initialize the service
authService.init();
