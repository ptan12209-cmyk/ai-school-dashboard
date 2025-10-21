/**
 * RecentActivity Component
 * =======================
 * Component for displaying recent activities
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const RecentActivity = ({ activities = [], title = "Recent Activity" }) => {
  const theme = useTheme();

  // Default activities if none provided
  const defaultActivities = [
    {
      id: 1,
      type: 'student',
      message: 'New student enrolled: John Doe',
      timestamp: '2 hours ago',
      icon: <PersonIcon />,
      color: 'primary',
    },
    {
      id: 2,
      type: 'grade',
      message: 'Grade submitted for Mathematics',
      timestamp: '4 hours ago',
      icon: <AssessmentIcon />,
      color: 'success',
    },
    {
      id: 3,
      type: 'attendance',
      message: 'Attendance marked for Class 10A',
      timestamp: '6 hours ago',
      icon: <CalendarIcon />,
      color: 'info',
    },
    {
      id: 4,
      type: 'teacher',
      message: 'Teacher profile updated: Sarah Wilson',
      timestamp: '1 day ago',
      icon: <SchoolIcon />,
      color: 'secondary',
    },
  ];

  const activityData = activities.length > 0 ? activities : defaultActivities;

  const getActivityIcon = (type) => {
    const icons = {
      student: <PersonIcon />,
      teacher: <SchoolIcon />,
      grade: <AssessmentIcon />,
      attendance: <CalendarIcon />,
    };
    return icons[type] || <PersonIcon />;
  };

  const getActivityColor = (type) => {
    const colors = {
      student: 'primary',
      teacher: 'secondary',
      grade: 'success',
      attendance: 'info',
    };
    return colors[type] || 'primary';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activityData.map((activity) => (
            <ListItem key={activity.id} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: theme.palette[getActivityColor(activity.type)].main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {activity.icon || getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {activity.message}
                    </Typography>
                    <Chip
                      label={activity.timestamp}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Activity
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
