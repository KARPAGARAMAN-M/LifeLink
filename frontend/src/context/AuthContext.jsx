import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRoleState] = useState(() => localStorage.getItem('selectedRole') || null);

  const selectRole = (role) => {
    setSelectedRoleState(role);
    if (role) {
      localStorage.setItem('selectedRole', role);
    } else {
      localStorage.removeItem('selectedRole');
    }
  };

  // Load persisted auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, roleHint = null) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data.data;
    setToken(data.token);
    const userRole = data.role || roleHint || 'SEEKER';
    const userObj = { id: data.id, name: data.name, email: data.email, role: userRole };
    setUser(userObj);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userObj));
    selectRole(userRole.toLowerCase());
    return data;
  };

  const register = async (userData) => {
    // userData can be object or string (name)
    const payload = typeof userData === 'object' ? userData : { name: arguments[0], email: arguments[1], password: arguments[2], role: 'SEEKER' };
    const response = await api.post('/auth/register', payload);
    const data = response.data.data;
    setToken(data.token);
    const userRole = data.role || payload.role || 'SEEKER';
    const userObj = { id: data.id, name: data.name, email: data.email, role: userRole };
    setUser(userObj);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userObj));
    selectRole(userRole.toLowerCase());
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSelectedRoleState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedRole');
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...current, ...updatedUser }));
  };

  const isAuthenticated = !!token;
  const userRole = user?.role ? user.role.toUpperCase() : (selectedRole ? selectedRole.toUpperCase() : null);
  const isSeeker = userRole === 'SEEKER';
  const isDonor = userRole === 'DONOR';

  const getDashboardPath = () => {
    if (isDonor) return '/donor/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated, selectedRole, userRole, isSeeker, isDonor, getDashboardPath,
      login, register, logout, updateUser, selectRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
