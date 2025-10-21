/**
 * Socket.io Service
 * ==================
 * Manages WebSocket connection for real-time notifications
 */

import { io } from 'socket.io-client';
import {
  addNotification,
  setUnreadCount,
  markAllNotificationsAsRead
} from '../redux/slices/notificationSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.store = null;
  }

  /**
   * Initialize socket connection
   */
  connect(token, store) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    this.store = store;

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupEventListeners();

    return this.socket;
  }

  /**
   * Set up socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // Notification events
    this.socket.on('new_notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      if (this.store) {
        this.store.dispatch(addNotification(notification));

        // Play notification sound (optional)
        this.playNotificationSound();

        // Show browser notification (optional)
        this.showBrowserNotification(notification);
      }
    });

    this.socket.on('notification_count', (count) => {
      console.log('📊 Notification count updated:', count);
      if (this.store) {
        this.store.dispatch(setUnreadCount(count));
      }
    });

    this.socket.on('all_notifications_read', () => {
      console.log('✅ All notifications marked as read');
      if (this.store) {
        this.store.dispatch(markAllNotificationsAsRead());
      }
    });

    this.socket.on('notification_deleted', (notificationId) => {
      console.log('🗑️ Notification deleted:', notificationId);
      // Redux will handle this through API responses
    });
  }

  /**
   * Request notification count
   */
  requestNotificationCount() {
    if (this.socket?.connected) {
      this.socket.emit('request_notification_count');
    }
  }

  /**
   * Mark notification as read via socket
   */
  markNotificationAsRead(notificationId) {
    if (this.socket?.connected) {
      this.socket.emit('mark_notification_read', notificationId);
    }
  }

  /**
   * Mark all notifications as read via socket
   */
  markAllAsRead() {
    if (this.socket?.connected) {
      this.socket.emit('mark_all_read');
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound() {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }

  /**
   * Show browser notification
   */
  async showBrowserNotification(notification) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }

  /**
   * Get socket instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
