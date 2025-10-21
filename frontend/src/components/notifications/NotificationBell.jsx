/**
 * Notification Bell Component
 * ============================
 * Displays notification icon with unread count badge and dropdown
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  // Fetch unread count on mount
  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Handle open dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0) {
      dispatch(fetchNotifications({ page: 1, limit: 10, filter: 'all' }));
    }
  };

  // Handle close dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    await dispatch(markAsRead(notificationId));
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  // Handle delete notification
  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    await dispatch(deleteNotification(notificationId));
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read if not already
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate to related page if applicable
    if (notification.related_type && notification.related_id) {
      handleClose();
      switch (notification.related_type) {
        case 'grade':
          navigate('/grades');
          break;
        case 'attendance':
          navigate('/attendance');
          break;
        case 'assignment':
          navigate('/courses');
          break;
        default:
          break;
      }
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'info',
      high: 'warning',
      urgent: 'error'
    };
    return colors[priority] || 'default';
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Thấp',
      medium: 'Trung Bình',
      high: 'Cao',
      urgent: 'Khẩn Cấp'
    };
    return labels[priority] || 'Trung Bình';
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch (error) {
      return 'Vừa xong';
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={`${unreadCount} thông báo chưa đọc`}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              Thông Báo
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkEmailReadIcon />}
                onClick={handleMarkAllAsRead}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {unreadCount} thông báo chưa đọc
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Notifications List */}
        {loading && notifications.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Không có thông báo nào
            </Typography>
          </MenuItem>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: 1.5,
                px: 2,
                backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                '&:hover': {
                  backgroundColor: notification.is_read ? 'action.hover' : 'action.selected'
                },
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ width: '100%' }}>
                {/* Title and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: notification.is_read ? 'normal' : 'bold', flex: 1 }}>
                    {notification.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!notification.is_read && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        sx={{ p: 0.5 }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(notification.id, e)}
                      sx={{ p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Message */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {notification.message}
                </Typography>

                {/* Footer: Priority and Time */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={getPriorityLabel(notification.priority)}
                    color={getPriorityColor(notification.priority)}
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(notification.created_at)}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  handleClose();
                  navigate('/notifications');
                }}
              >
                Xem Tất Cả Thông Báo
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
