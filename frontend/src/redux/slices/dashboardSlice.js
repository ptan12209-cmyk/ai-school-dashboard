// dashboardSlice.js - Redux slice for dashboard data
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import dashboardService from '../../services/dashboardService'; // Assuming a service exists

const initialState = {
  stats: {},
  charts: {},
  recentActivities: [],
  loading: false,
  error: null,
};

// Example async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // const response = await dashboardService.getDashboardData();
      // return response.data;
      return { stats: {}, charts: {}, recentActivities: [] }; // Mock data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.charts = action.payload.charts;
        state.recentActivities = action.payload.recentActivities;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;

