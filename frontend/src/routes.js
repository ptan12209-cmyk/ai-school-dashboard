/**
 * routes.js - React Router Configuration
 * ========================================
 * Central routing configuration following PROJECT_STRUCTURE.md
 */

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Layout Components
import MainLayout from './components/common/MainLayout.jsx';
import AuthLayout from './components/common/AuthLayout.jsx';

// Page Components
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import TeachersPage from './pages/TeachersPage.jsx';
import ClassesPage from './pages/ClassesPage.jsx';
import CoursePage from './pages/CoursePage.jsx';
import GradesPage from './pages/GradesPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AIPredictionPage from './pages/AIPredictionPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Auth Guard
import PrivateRoute from './components/common/PrivateRoute.jsx';

// Loading component for Suspense fallback
const SuspenseLoader = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="200px"
  >
    <CircularProgress />
  </Box>
);

/**
 * Application Routes
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Routes with Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

      {/* Protected Routes with Main Layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard - Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Student Management */}
          <Route path="/students" element={<StudentsPage />} />
          
          {/* Teacher Management */}
          <Route path="/teachers" element={<TeachersPage />} />

          {/* Class Management */}
          <Route path="/classes" element={<ClassesPage />} />

          {/* Course Management */}
          <Route path="/courses" element={<CoursePage />} />
          
          {/* Grade Management */}
          <Route path="/grades" element={<GradesPage />} />
          
          {/* Attendance Management */}
          <Route path="/attendance" element={<AttendancePage />} />
          
          {/* Reports */}
          <Route path="/reports" element={<ReportPage />} />
          
          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* AI Features */}
          <Route path="/ai-predictions" element={<AIPredictionPage />} />
        </Route>
      </Route>

      {/* 404 Not Found - Catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
