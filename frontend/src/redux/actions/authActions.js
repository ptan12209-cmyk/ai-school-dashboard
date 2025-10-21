/**
 * authActions.js - Authentication Actions
 * ========================================
 * Redux actions for authentication following PROJECT_STRUCTURE.md
 * Using traditional Redux with redux-thunk
 */

import authService from '../../services/authService.js';

/**
 * Action Types
 */
export const AUTH_ACTION_TYPES = {
  // Login
  LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',
  
  // Register
  REGISTER_REQUEST: 'AUTH/REGISTER_REQUEST',
  REGISTER_SUCCESS: 'AUTH/REGISTER_SUCCESS',
  REGISTER_FAILURE: 'AUTH/REGISTER_FAILURE',
  
  // Logout
  LOGOUT_REQUEST: 'AUTH/LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'AUTH/LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'AUTH/LOGOUT_FAILURE',
  
  // Get Current User
  GET_CURRENT_USER_REQUEST: 'AUTH/GET_CURRENT_USER_REQUEST',
  GET_CURRENT_USER_SUCCESS: 'AUTH/GET_CURRENT_USER_SUCCESS',
  GET_CURRENT_USER_FAILURE: 'AUTH/GET_CURRENT_USER_FAILURE',
  
  // Update Profile
  UPDATE_PROFILE_REQUEST: 'AUTH/UPDATE_PROFILE_REQUEST',
  UPDATE_PROFILE_SUCCESS: 'AUTH/UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_FAILURE: 'AUTH/UPDATE_PROFILE_FAILURE',
  
  // Clear Error
  CLEAR_AUTH_ERROR: 'AUTH/CLEAR_AUTH_ERROR',
  
  // Reset State
  RESET_AUTH_STATE: 'AUTH/RESET_AUTH_STATE'
};

/**
 * Action Creators
 */

// Login Actions
export const loginRequest = () => ({
  type: AUTH_ACTION_TYPES.LOGIN_REQUEST
});

export const loginSuccess = (data) => ({
  type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
  payload: data
});

export const loginFailure = (error) => ({
  type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
  payload: error
});

// Register Actions
export const registerRequest = () => ({
  type: AUTH_ACTION_TYPES.REGISTER_REQUEST
});

export const registerSuccess = (data) => ({
  type: AUTH_ACTION_TYPES.REGISTER_SUCCESS,
  payload: data
});

export const registerFailure = (error) => ({
  type: AUTH_ACTION_TYPES.REGISTER_FAILURE,
  payload: error
});

// Logout Actions
export const logoutRequest = () => ({
  type: AUTH_ACTION_TYPES.LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
  type: AUTH_ACTION_TYPES.LOGOUT_SUCCESS
});

export const logoutFailure = (error) => ({
  type: AUTH_ACTION_TYPES.LOGOUT_FAILURE,
  payload: error
});

// Get Current User Actions
export const getCurrentUserRequest = () => ({
  type: AUTH_ACTION_TYPES.GET_CURRENT_USER_REQUEST
});

export const getCurrentUserSuccess = (data) => ({
  type: AUTH_ACTION_TYPES.GET_CURRENT_USER_SUCCESS,
  payload: data
});

export const getCurrentUserFailure = (error) => ({
  type: AUTH_ACTION_TYPES.GET_CURRENT_USER_FAILURE,
  payload: error
});

// Update Profile Actions
export const updateProfileRequest = () => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE_REQUEST
});

export const updateProfileSuccess = (data) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
  payload: data
});

export const updateProfileFailure = (error) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE_FAILURE,
  payload: error
});

// Clear Error Action
export const clearAuthError = () => ({
  type: AUTH_ACTION_TYPES.CLEAR_AUTH_ERROR
});

// Reset Auth State
export const resetAuthState = () => ({
  type: AUTH_ACTION_TYPES.RESET_AUTH_STATE
});

/**
 * Thunk Actions (Async)
 */

/**
 * Login User
 * @param {Object} credentials - Email and password
 */
export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    
    try {
      const response = await authService.login(credentials);
      const { user, profile, token } = response.data;
      
      dispatch(loginSuccess({
        user,
        profile,
        token
      }));
      
      return { type: 'fulfilled', payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { type: 'rejected', payload: errorMessage };
    }
  };
};

/**
 * Register User
 * @param {Object} userData - User registration data
 */
export const registerUser = (userData) => {
  return async (dispatch) => {
    dispatch(registerRequest());
    
    try {
      const response = await authService.register(userData);
      const { user, profile, token } = response.data;
      
      dispatch(registerSuccess({
        user,
        profile,
        token
      }));
      
      return { type: 'fulfilled', payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
      return { type: 'rejected', payload: errorMessage };
    }
  };
};

/**
 * Logout User
 */
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(logoutRequest());
    
    try {
      await authService.logout();
      dispatch(logoutSuccess());
      return { type: 'fulfilled' };
    } catch (error) {
      // Even if API fails, logout locally
      dispatch(logoutSuccess());
      return { type: 'fulfilled' };
    }
  };
};

/**
 * Get Current User
 */
export const getCurrentUser = () => {
  return async (dispatch) => {
    dispatch(getCurrentUserRequest());
    
    try {
      const response = await authService.getCurrentUser();
      const { user, profile } = response.data;
      
      dispatch(getCurrentUserSuccess({
        user,
        profile
      }));
      
      return { type: 'fulfilled', payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user';
      dispatch(getCurrentUserFailure(errorMessage));
      return { type: 'rejected', payload: errorMessage };
    }
  };
};

/**
 * Update User Profile
 * @param {Object} profileData - Profile update data
 */
export const updateProfile = (profileData) => {
  return async (dispatch) => {
    dispatch(updateProfileRequest());
    
    try {
      const response = await authService.updateProfile(profileData);
      const { user, profile } = response.data;
      
      dispatch(updateProfileSuccess({
        user,
        profile
      }));
      
      return { type: 'fulfilled', payload: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      dispatch(updateProfileFailure(errorMessage));
      return { type: 'rejected', payload: errorMessage };
    }
  };
};

/**
 * Check Authentication Status
 */
export const checkAuthStatus = () => {
  return (dispatch) => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    } else {
      dispatch(resetAuthState());
    }
  };
};
