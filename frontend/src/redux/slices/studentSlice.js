// Redux slice for Student Management
// Full CRUD operations with async thunks
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentService from '../../services/studentService.js';

// Initial state
const initialState = {
  students: [],
  selectedStudent: null,
  totalStudents: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  searchTerm: '',
  filters: {
    class: '',
    gender: '',
    status: 'active',
    grade: ''
  },
  sortBy: 'name',
  sortOrder: 'asc',
  loading: false,
  operationLoading: false,
  error: null,
  successMessage: null
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
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
      const response = await studentService.getStudents(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await studentService.getStudentById(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student details');
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await studentService.createStudent(studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create student');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ studentId, studentData }, { rejectWithValue }) => {
    try {
      const response = await studentService.updateStudent(studentId, studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      await studentService.deleteStudent(studentId);
      return studentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete student');
    }
  }
);

export const bulkDeleteStudents = createAsyncThunk(
  'students/bulkDeleteStudents',
  async (studentIds, { rejectWithValue }) => {
    try {
      await studentService.bulkDelete(studentIds);
      return studentIds;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete students');
    }
  }
);

export const importStudents = createAsyncThunk(
  'students/importStudents',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await studentService.importStudents(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to import students');
    }
  }
);

export const exportStudents = createAsyncThunk(
  'students/exportStudents',
  async ({ format = 'excel', filters } = {}, { rejectWithValue }) => {
    try {
      const response = await studentService.exportStudents({ format, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export students');
    }
  }
);

// Slice
const studentSlice = createSlice({
  name: 'students',
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
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students || action.payload.data || [];
        state.totalStudents = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || Math.ceil(action.payload.total / state.pageSize);
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.selectedStudent = action.payload.student || action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Create student
      .addCase(createStudent.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.students.unshift(action.payload.student || action.payload);
        state.totalStudents += 1;
        state.successMessage = 'Student created successfully';
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedStudent = action.payload.student || action.payload;
        const index = state.students.findIndex(s => s.id === updatedStudent.id);
        if (index !== -1) {
          state.students[index] = updatedStudent;
        }
        state.selectedStudent = updatedStudent;
        state.successMessage = 'Student updated successfully';
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
        state.totalStudents -= 1;
        state.successMessage = 'Student deleted successfully';
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })
      // Bulk delete
      .addCase(bulkDeleteStudents.fulfilled, (state, action) => {
        state.students = state.students.filter(s => !action.payload.includes(s.id));
        state.totalStudents -= action.payload.length;
        state.successMessage = `${action.payload.length} students deleted successfully`;
      })
      // Import students
      .addCase(importStudents.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(importStudents.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.successMessage = `${action.payload.imported} students imported successfully`;
      })
      .addCase(importStudents.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
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
  clearSelectedStudent,
  clearMessages
} = studentSlice.actions;

// Selectors
export const selectAllStudents = (state) => state.students.students;
export const selectStudentById = (state, studentId) => 
  state.students.students.find(s => s.id === studentId);
export const selectSelectedStudent = (state) => state.students.selectedStudent;
export const selectStudentsLoading = (state) => state.students.loading;
export const selectOperationLoading = (state) => state.students.operationLoading;
export const selectStudentsError = (state) => state.students.error;
export const selectSuccessMessage = (state) => state.students.successMessage;
export const selectPagination = (state) => ({
  currentPage: state.students.currentPage,
  pageSize: state.students.pageSize,
  totalStudents: state.students.totalStudents,
  totalPages: state.students.totalPages
});

// Export reducer
export default studentSlice.reducer;
