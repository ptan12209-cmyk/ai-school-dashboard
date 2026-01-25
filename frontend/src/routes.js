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

// Auth Guard
import PrivateRoute from './components/common/PrivateRoute.jsx';

// Page Components - Lazy Loaded for Performance
const LoginPage = React.lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.jsx'));
const StudentsPage = React.lazy(() => import('./pages/StudentsPage.jsx'));
const TeachersPage = React.lazy(() => import('./pages/TeachersPage.jsx'));
const ClassesPage = React.lazy(() => import('./pages/ClassesPage.jsx'));
const CoursePage = React.lazy(() => import('./pages/CoursePage.jsx'));
const GradesPage = React.lazy(() => import('./pages/GradesPage.jsx'));
const AttendancePage = React.lazy(() => import('./pages/AttendancePage.jsx'));
const ReportPage = React.lazy(() => import('./pages/ReportPage.jsx'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.jsx'));
const AIPredictionPage = React.lazy(() => import('./pages/AIPredictionPage.jsx'));
const StudentAssignmentsPage = React.lazy(() => import('./pages/StudentAssignmentsPage.jsx'));
const TakeAssignmentPage = React.lazy(() => import('./pages/TakeAssignmentPage.jsx'));
const TeacherAssignmentsPage = React.lazy(() => import('./pages/TeacherAssignmentsPage.jsx'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage.jsx'));

// Auth Guard
// PrivateRoute imported at the top

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

          {/* Assignment Management */}
          <Route path="/assignments" element={<StudentAssignmentsPage />} />
          <Route path="/assignments/teacher" element={<TeacherAssignmentsPage />} />
          <Route path="/assignments/:assignmentId/take" element={<TakeAssignmentPage />} />

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
