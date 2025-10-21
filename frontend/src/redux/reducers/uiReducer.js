/**
 * uiReducer.js - UI State Reducer
 * =================================
 * Manages UI state like loading, modals, sidebars
 * Following PROJECT_STRUCTURE.md
 */

// Action Types
export const UI_ACTION_TYPES = {
  SET_LOADING: 'UI/SET_LOADING',
  TOGGLE_SIDEBAR: 'UI/TOGGLE_SIDEBAR',
  OPEN_MODAL: 'UI/OPEN_MODAL',
  CLOSE_MODAL: 'UI/CLOSE_MODAL',
  SET_THEME: 'UI/SET_THEME',
  SHOW_NOTIFICATION: 'UI/SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'UI/HIDE_NOTIFICATION'
};

// Initial State
const initialState = {
  loading: false,
  sidebarOpen: true,
  modal: {
    open: false,
    type: null,
    data: null
  },
  theme: localStorage.getItem('theme') || 'light',
  notification: {
    show: false,
    type: 'info',
    message: ''
  }
};

// Reducer
const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case UI_ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case UI_ACTION_TYPES.OPEN_MODAL:
      return {
        ...state,
        modal: {
          open: true,
          type: action.payload.type,
          data: action.payload.data
        }
      };
      
    case UI_ACTION_TYPES.CLOSE_MODAL:
      return {
        ...state,
        modal: {
          open: false,
          type: null,
          data: null
        }
      };
      
    case UI_ACTION_TYPES.SET_THEME:
      localStorage.setItem('theme', action.payload);
      return {
        ...state,
        theme: action.payload
      };
      
    case UI_ACTION_TYPES.SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: true,
          type: action.payload.type,
          message: action.payload.message
        }
      };
      
    case UI_ACTION_TYPES.HIDE_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: false,
          type: 'info',
          message: ''
        }
      };
      
    default:
      return state;
  }
};

export default uiReducer;

// Action Creators
export const setLoading = (loading) => ({
  type: UI_ACTION_TYPES.SET_LOADING,
  payload: loading
});

export const toggleSidebar = () => ({
  type: UI_ACTION_TYPES.TOGGLE_SIDEBAR
});

export const openModal = (type, data) => ({
  type: UI_ACTION_TYPES.OPEN_MODAL,
  payload: { type, data }
});

export const closeModal = () => ({
  type: UI_ACTION_TYPES.CLOSE_MODAL
});

export const setTheme = (theme) => ({
  type: UI_ACTION_TYPES.SET_THEME,
  payload: theme
});

export const showNotification = (type, message) => ({
  type: UI_ACTION_TYPES.SHOW_NOTIFICATION,
  payload: { type, message }
});

export const hideNotification = () => ({
  type: UI_ACTION_TYPES.HIDE_NOTIFICATION
});