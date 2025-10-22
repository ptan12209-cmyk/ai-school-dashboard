/**
 * Assignment Redux Slice
 * ======================
 * State management for assignments and submissions
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Async thunks
 */

// Get assignments by course
export const fetchAssignmentsByCourse = createAsyncThunk(
  'assignments/fetchByCourse',
  async ({ courseId, filters = {} }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/assignments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch assignments' });
    }
  }
);

// Get student assignments
export const fetchStudentAssignments = createAsyncThunk(
  'assignments/fetchStudentAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/assignments/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch assignments' });
    }
  }
);

// Get assignment by ID
export const fetchAssignment = createAsyncThunk(
  'assignments/fetchById',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch assignment' });
    }
  }
);

// Create assignment
export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/assignments`, assignmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create assignment' });
    }
  }
);

// Update assignment
export const updateAssignment = createAsyncThunk(
  'assignments/update',
  async ({ assignmentId, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/assignments/${assignmentId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update assignment' });
    }
  }
);

// Delete assignment
export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete assignment' });
    }
  }
);

// Publish assignment
export const publishAssignment = createAsyncThunk(
  'assignments/publish',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/assignments/${assignmentId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to publish assignment' });
    }
  }
);

// Start assignment (create submission)
export const startAssignment = createAsyncThunk(
  'assignments/start',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/assignments/${assignmentId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to start assignment' });
    }
  }
);

// Submit assignment
export const submitAssignment = createAsyncThunk(
  'assignments/submit',
  async ({ submissionId, answers }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/assignments/submit`,
        { submissionId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to submit assignment' });
    }
  }
);

// Get submissions for grading
export const fetchSubmissions = createAsyncThunk(
  'assignments/fetchSubmissions',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/assignments/${assignmentId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch submissions' });
    }
  }
);

// Grade submission
export const gradeSubmission = createAsyncThunk(
  'assignments/gradeSubmission',
  async ({ submissionId, gradedAnswers, feedback }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/assignments/submissions/${submissionId}/grade`,
        { gradedAnswers, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to grade submission' });
    }
  }
);

// Get assignment statistics
export const fetchAssignmentStatistics = createAsyncThunk(
  'assignments/fetchStatistics',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/assignments/${assignmentId}/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch statistics' });
    }
  }
);

/**
 * Initial state
 */
const initialState = {
  assignments: [],
  currentAssignment: null,
  currentSubmission: null,
  submissions: [],
  statistics: null,
  loading: false,
  error: null
};

/**
 * Assignment slice
 */
const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch assignments by course
    builder
      .addCase(fetchAssignmentsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.data;
      })
      .addCase(fetchAssignmentsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch assignments';
      });

    // Fetch student assignments
    builder
      .addCase(fetchStudentAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.data;
      })
      .addCase(fetchStudentAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch assignments';
      });

    // Fetch assignment by ID
    builder
      .addCase(fetchAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload.data;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch assignment';
      });

    // Create assignment
    builder
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.unshift(action.payload.data);
        state.currentAssignment = action.payload.data;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create assignment';
      });

    // Update assignment
    builder
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a.id === action.payload.data.id);
        if (index !== -1) {
          state.assignments[index] = action.payload.data;
        }
        state.currentAssignment = action.payload.data;
      });

    // Delete assignment
    builder
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(a => a.id !== action.payload);
      });

    // Publish assignment
    builder
      .addCase(publishAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a.id === action.payload.data.id);
        if (index !== -1) {
          state.assignments[index] = action.payload.data;
        }
        state.currentAssignment = action.payload.data;
      });

    // Start assignment
    builder
      .addCase(startAssignment.fulfilled, (state, action) => {
        state.currentSubmission = action.payload.data;
      });

    // Submit assignment
    builder
      .addCase(submitAssignment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubmission = action.payload.data;
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to submit assignment';
      });

    // Fetch submissions
    builder
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload.data;
      });

    // Grade submission
    builder
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        const index = state.submissions.findIndex(s => s.id === action.payload.data.id);
        if (index !== -1) {
          state.submissions[index] = action.payload.data;
        }
      });

    // Fetch statistics
    builder
      .addCase(fetchAssignmentStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  }
});

export const { clearCurrentAssignment, clearCurrentSubmission, clearError } = assignmentSlice.actions;

export default assignmentSlice.reducer;
