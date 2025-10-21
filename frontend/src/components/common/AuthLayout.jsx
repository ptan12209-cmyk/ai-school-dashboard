/**
 * AuthLayout Component
 * ===================
 * Authentication layout for login/register pages
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            padding: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ mb: 4 }}>
            <SchoolIcon
              sx={{
                fontSize: 64,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
              }}
            >
              AI School Dashboard
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Intelligent Education Management System
            </Typography>
          </Box>

          {/* Auth Form Content */}
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
