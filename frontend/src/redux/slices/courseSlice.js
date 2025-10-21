// courseSlice.js - Redux slice for course management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import courseService from '../../services/courseService'; // Assuming a service exists

const initialState = {
  courses: [],
  loading: false,
  error: null,
};

// Example async thunk for fetching courses
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params, { rejectWithValue }) => {
    try {
      // const response = await courseService.getCourses(params);
      // return response.data;
      return []; // Returning mock data for now
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
