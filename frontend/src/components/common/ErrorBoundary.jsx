/**
 * Error Boundary Component
 * ========================
 * Catches JavaScript errors anywhere in the component tree
 * Logs errors and displays a fallback UI
 */

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);

    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            p: 3
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              p: 4,
              textAlign: 'center'
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2
              }}
            />

            <Typography variant="h4" gutterBottom color="error">
              Oops! Có lỗi xảy ra
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Xin lỗi, đã có lỗi không mong muốn xảy ra. Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: '#fff3e0',
                  textAlign: 'left',
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem'
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Paper>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Tải lại trang
              </Button>
              <Button
                variant="contained"
                onClick={this.handleGoHome}
              >
                Về trang chủ
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
