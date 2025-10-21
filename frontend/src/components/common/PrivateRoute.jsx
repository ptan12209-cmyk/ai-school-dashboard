/**
 * PrivateRoute.jsx - Private Route Component
 * ============================================
 * Protects routes that require authentication
 * Following PROJECT_STRUCTURE.md
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

/**
 * Private Route Component
 * Wraps protected routes
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');

  // Show loading while checking auth
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default PrivateRoute;