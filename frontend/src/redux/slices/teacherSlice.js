// Redux slice for Teacher Management
// Full CRUD operations with async thunks
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teacherService from '../../services/teacherService.js';

// Initial state
const initialState = {
  teachers: [],
  selectedTeacher: null,
  totalTeachers: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  searchTerm: '',
  filters: {
    department: '',
    subject: '',
    gender: '',
    status: 'active',
    qualification: '',
    experience: ''
  },
  sortBy: 'name',
  sortOrder: 'asc',
  loading: false,
  operationLoading: false,
  error: null,
  successMessage: null,
  departments: [],
  subjects: []
};

// Async thunks
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async ({ page, pageSize, search, filters, sortBy, sortOrder } = {}, { rejectWithValue }) => {
    try {
      const params = {
        page: page || 1,
        limit: pageSize || 10,
        search: search || '',
        ...filters,
        sortBy: sortBy || 'name',
        sortOrder: sortOrder || 'asc'
      };
      const response = await teacherService.getTeachers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchTeacherById',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await teacherService.getTeacherById(teacherId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher details');
    }
  }
);

export const createTeacher = createAsyncThunk(
  'teachers/createTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await teacherService.createTeacher(teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create teacher');
    }
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ teacherId, teacherData }, { rejectWithValue }) => {
    try {
      const response = await teacherService.updateTeacher(teacherId, teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update teacher');
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (teacherId, { rejectWithValue }) => {
    try {
      await teacherService.deleteTeacher(teacherId);
      return teacherId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teacher');
    }
  }
);

export const bulkDeleteTeachers = createAsyncThunk(
  'teachers/bulkDeleteTeachers',
  async (teacherIds, { rejectWithValue }) => {
    try {
      await teacherService.bulkDelete(teacherIds);
      return teacherIds;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teachers');
    }
  }
);

export const importTeachers = createAsyncThunk(
  'teachers/importTeachers',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await teacherService.importTeachers(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to import teachers');
    }
  }
);

export const exportTeachers = createAsyncThunk(
  'teachers/exportTeachers',
  async ({ format = 'excel', filters } = {}, { rejectWithValue }) => {
    try {
      const response = await teacherService.exportTeachers({ format, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export teachers');
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  'teachers/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teacherService.getDepartments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const fetchSubjects = createAsyncThunk(
  'teachers/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teacherService.getSubjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subjects');
    }
  }
);

export const assignClassToTeacher = createAsyncThunk(
  'teachers/assignClass',
  async ({ teacherId, classId }, { rejectWithValue }) => {
    try {
      const response = await teacherService.assignClass(teacherId, classId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign class');
    }
  }
);

// Slice
const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle backend response: { success: true, data: { teachers: [...], pagination: {...} } }
        const responseData = action.payload.data || action.payload;
        state.teachers = responseData.teachers || [];
        state.totalTeachers = responseData.pagination?.total || responseData.total || 0;
        state.totalPages = responseData.pagination?.pages || responseData.totalPages || Math.ceil((responseData.pagination?.total || 0) / state.pageSize);
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.selectedTeacher = action.payload.teacher || action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Create teacher
      .addCase(createTeacher.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.teachers.unshift(action.payload.teacher || action.payload);
        state.totalTeachers += 1;
        state.successMessage = 'Teacher created successfully';
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Update teacher
      .addCase(updateTeacher.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedTeacher = action.payload.teacher || action.payload;
        const index = state.teachers.findIndex(t => t.id === updatedTeacher.id);
        if (index !== -1) {
          state.teachers[index] = updatedTeacher;
        }
        state.selectedTeacher = updatedTeacher;
        state.successMessage = 'Teacher updated successfully';
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Delete teacher
      .addCase(deleteTeacher.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.teachers = state.teachers.filter(t => t.id !== action.payload);
        state.totalTeachers -= 1;
        state.successMessage = 'Teacher deleted successfully';
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Bulk delete
      .addCase(bulkDeleteTeachers.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(t => !action.payload.includes(t.id));
        state.totalTeachers -= action.payload.length;
        state.successMessage = `${action.payload.length} teachers deleted successfully`;
      })
      // Import teachers
      .addCase(importTeachers.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(importTeachers.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.successMessage = `${action.payload.imported} teachers imported successfully`;
      })
      .addCase(importTeachers.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Fetch departments
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload.departments || action.payload || [];
      })
      // Fetch subjects
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload.subjects || action.payload || [];
      })
      // Assign class
      .addCase(assignClassToTeacher.fulfilled, (state, action) => {
        state.successMessage = 'Class assigned successfully';
      });
  }
});

// Export actions
export const {
  setSearchTerm,
  setFilters,
  resetFilters,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setPageSize,
  clearSelectedTeacher,
  clearMessages
} = teacherSlice.actions;

// Selectors
export const selectAllTeachers = (state) => state.teachers.teachers;
export const selectTeacherById = (state, teacherId) => 
  state.teachers.teachers.find(t => t.id === teacherId);
export const selectSelectedTeacher = (state) => state.teachers.selectedTeacher;
export const selectTeachersLoading = (state) => state.teachers.loading;
export const selectOperationLoading = (state) => state.teachers.operationLoading;
export const selectTeachersError = (state) => state.teachers.error;
export const selectSuccessMessage = (state) => state.teachers.successMessage;
export const selectDepartments = (state) => state.teachers.departments;
export const selectSubjects = (state) => state.teachers.subjects;
export const selectPagination = (state) => ({
  currentPage: state.teachers.currentPage,
  pageSize: state.teachers.pageSize,
  totalTeachers: state.teachers.totalTeachers,
  totalPages: state.teachers.totalPages
});

// Export reducer
export default teacherSlice.reducer;
