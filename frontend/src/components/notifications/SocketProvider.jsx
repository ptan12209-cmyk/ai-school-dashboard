/**
 * Socket Provider Component
 * ==========================
 * Manages Socket.io connection lifecycle
 */

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStore } from 'react-redux';
import socketService from '../../services/socketService';

const SocketProvider = ({ children }) => {
  const store = useStore();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Connect socket when user is authenticated
      console.log('🔌 Connecting socket...');
      socketService.connect(token, store);

      // Request initial notification count
      setTimeout(() => {
        socketService.requestNotificationCount();
      }, 1000);

      // Cleanup on unmount or logout
      return () => {
        console.log('🔌 Disconnecting socket...');
        socketService.disconnect();
      };
    } else {
      // Disconnect socket when user logs out
      socketService.disconnect();
    }
  }, [isAuthenticated, token, store]);

  return children;
};

export default SocketProvider;
