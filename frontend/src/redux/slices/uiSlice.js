/**
 * UI Slice - Redux Toolkit
 * ========================
 * UI state management
 */

import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  notifications: [],
  modals: {
    studentForm: false,
    teacherForm: false,
    courseForm: false,
    gradeForm: false,
    attendanceForm: false,
    deleteConfirm: false,
  },
  selectedItems: [],
  filters: {
    students: {},
    teachers: {},
    courses: {},
    grades: {},
    attendance: {},
  },
  pagination: {
    students: { page: 1, limit: 10, total: 0 },
    teachers: { page: 1, limit: 10, total: 0 },
    courses: { page: 1, limit: 10, total: 0 },
    grades: { page: 1, limit: 10, total: 0 },
    attendance: { page: 1, limit: 10, total: 0 },
  },
  search: {
    students: '',
    teachers: '',
    courses: '',
    grades: '',
    attendance: '',
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Loading actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modal actions
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Selection actions
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    addSelectedItem: (state, action) => {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    removeSelectedItem: (state, action) => {
      state.selectedItems = state.selectedItems.filter(
        item => item !== action.payload
      );
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
    
    // Filter actions
    setFilter: (state, action) => {
      const { entity, filter } = action.payload;
      state.filters[entity] = { ...state.filters[entity], ...filter };
    },
    clearFilter: (state, action) => {
      const { entity, key } = action.payload;
      if (key) {
        delete state.filters[entity][key];
      } else {
        state.filters[entity] = {};
      }
    },
    clearAllFilters: (state) => {
      Object.keys(state.filters).forEach(key => {
        state.filters[key] = {};
      });
    },
    
    // Pagination actions
    setPagination: (state, action) => {
      const { entity, pagination } = action.payload;
      state.pagination[entity] = { ...state.pagination[entity], ...pagination };
    },
    setPage: (state, action) => {
      const { entity, page } = action.payload;
      state.pagination[entity].page = page;
    },
    setLimit: (state, action) => {
      const { entity, limit } = action.payload;
      state.pagination[entity].limit = limit;
      state.pagination[entity].page = 1; // Reset to first page when changing limit
    },
    
    // Search actions
    setSearch: (state, action) => {
      const { entity, search } = action.payload;
      state.search[entity] = search;
    },
    clearSearch: (state, action) => {
      state.search[action.payload] = '';
    },
    clearAllSearch: (state) => {
      Object.keys(state.search).forEach(key => {
        state.search[key] = '';
      });
    },
    
    // Reset actions
    resetUI: (state) => {
      return { ...initialState };
    },
    resetEntityUI: (state, action) => {
      const entity = action.payload;
      state.filters[entity] = {};
      state.pagination[entity] = { page: 1, limit: 10, total: 0 };
      state.search[entity] = '';
      state.selectedItems = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setSelectedItems,
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  setFilter,
  clearFilter,
  clearAllFilters,
  setPagination,
  setPage,
  setLimit,
  setSearch,
  clearSearch,
  clearAllSearch,
  resetUI,
  resetEntityUI,
} = uiSlice.actions;

export default uiSlice.reducer;
