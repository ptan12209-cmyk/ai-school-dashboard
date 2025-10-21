/**
 * authReducer.js - Authentication Reducer
 * =========================================
 * Redux reducer for authentication following PROJECT_STRUCTURE.md
 * Using traditional Redux pattern
 */

import { AUTH_ACTION_TYPES } from '../actions/authActions';

/**
 * Initial State
 */
const initialState = {
  user: null,
  profile: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastLogin: null
};

/**
 * Auth Reducer
 */
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login Cases
    case AUTH_ACTION_TYPES.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
        lastLogin: new Date().toISOString()
      };
      
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    
    // Register Cases
    case AUTH_ACTION_TYPES.REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case AUTH_ACTION_TYPES.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
        lastLogin: new Date().toISOString()
      };
      
    case AUTH_ACTION_TYPES.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    
    // Logout Cases
    case AUTH_ACTION_TYPES.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true
      };
      
    case AUTH_ACTION_TYPES.LOGOUT_SUCCESS:
      return {
        ...initialState,
        token: null
      };
      
    case AUTH_ACTION_TYPES.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Get Current User Cases
    case AUTH_ACTION_TYPES.GET_CURRENT_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
      
    case AUTH_ACTION_TYPES.GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
        error: null
      };
      
    case AUTH_ACTION_TYPES.GET_CURRENT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        profile: null,
        token: null
      };
    
    // Update Profile Cases
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true
      };
      
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null
      };
      
    case AUTH_ACTION_TYPES.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Clear Error
    case AUTH_ACTION_TYPES.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };
    
    // Reset State
    case AUTH_ACTION_TYPES.RESET_AUTH_STATE:
      return initialState;
    
    default:
      return state;
  }
};

export default authReducer;

/**
 * Selectors
 * Helper functions to get data from state
 */
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectProfile = (state) => state.auth.profile;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;