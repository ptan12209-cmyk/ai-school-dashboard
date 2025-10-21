// classSlice.js - Redux slice for class management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import classService from '../../services/classService'; // Assuming a service exists

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

// Example async thunk for fetching classes
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (params, { rejectWithValue }) => {
    try {
      // const response = await classService.getClasses(params);
      // return response.data;
      return []; // Returning mock data for now
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classSlice.reducer;

