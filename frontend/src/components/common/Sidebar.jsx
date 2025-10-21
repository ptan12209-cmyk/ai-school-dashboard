/**
 * Sidebar Component
 * ================
 * Navigation sidebar component
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Psychology as PsychologyIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const menuItems = [
  {
    text: 'Tổng Quan',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Học Sinh',
    icon: <PeopleIcon />,
    path: '/students',
  },
  {
    text: 'Giáo Viên',
    icon: <SchoolIcon />,
    path: '/teachers',
  },
  {
    text: 'Lớp Học',
    icon: <SchoolIcon />,
    path: '/classes',
  },
  {
    text: 'Khóa Học',
    icon: <SchoolIcon />,
    path: '/courses',
  },
  {
    text: 'Điểm Số',
    icon: <AssessmentIcon />,
    path: '/grades',
  },
  {
    text: 'Điểm Danh',
    icon: <CalendarIcon />,
    path: '/attendance',
  },
  {
    text: 'Dự Đoán AI',
    icon: <PsychologyIcon />,
    path: '/ai-predictions',
  },
  {
    text: 'Báo Cáo',
    icon: <BarChartIcon />,
    path: '/reports',
  },
  {
    text: 'Cài Đặt',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Title */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          AI School
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Dashboard
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                  color: isActive ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? theme.palette.primary.dark 
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          AI School Dashboard v1.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
