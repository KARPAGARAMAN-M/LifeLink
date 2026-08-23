import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDonorRequests, getMyRequests } from '../api/requestApi';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const items = [];
      // Fetch donor request notifications if user is donor or user
      const res = await getDonorRequests().catch(() => ({ data: { data: [] } }));
      const requests = res.data?.data || [];
      
      requests.forEach((req) => {
        if (req.status === 'PENDING') {
          items.push({
            id: `req-${req.id}`,
            title: `Blood Needed: ${req.bloodGroup}`,
            message: `${req.unitsNeeded} units requested at ${req.hospitalName}, ${req.city}`,
            urgency: req.urgency,
            time: req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent',
            read: false,
            link: '/request-history',
          });
        }
      });

      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.read).length);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, refresh: fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
