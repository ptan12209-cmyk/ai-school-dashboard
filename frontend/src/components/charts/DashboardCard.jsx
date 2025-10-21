/**
 * DashboardCard Component
 * ======================
 * Reusable card component for dashboard statistics
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  trend,
  trendValue 
}) => {
  const theme = useTheme();

  const getColorValue = (colorName) => {
    const colors = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
    };
    return colors[colorName] || colors.primary;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: `${getColorValue(color)}20`,
              color: getColorValue(color),
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: getColorValue(color),
            }}
          >
            {value}
          </Typography>
          {trend && trendValue && (
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: trend === 'up' ? 'success.main' : 'error.main',
                fontWeight: 500,
              }}
            >
              {trend === 'up' ? '+' : ''}{trendValue}%
            </Typography>
          )}
        </Box>

        {trend && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {trend === 'up' ? '↗' : '↘'} vs last period
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
