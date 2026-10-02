import api from './api';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

const DEMO_USER_KEY = 'sales_savvy_demo_user';

export const authService = {
  login: async (credentials) => {
    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const email = credentials.username.includes('@')
          ? credentials.username
          : `${credentials.username}@salessavvy.com`;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: credentials.password,
        });

        if (!error && data.user) {
          const role =
            data.user.user_metadata?.role ||
            (credentials.username.toLowerCase() === 'admin' ? 'ADMIN' : 'CUSTOMER');
          const authData = {
            username: credentials.username,
            userId: data.user.id,
            role: role,
          };
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(authData));
          return authData;
        }
      } catch (err) {
        console.warn('Supabase auth attempt:', err.message);
      }
    }

    // 2. Try Backend API
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data && response.data.role) {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      // Backend unavailable
    }

    // 3. Fallback demo authentication for testing on Vercel preview
    if (
      (credentials.username === 'admin' && credentials.password === 'Admin@123') ||
      (credentials.username === 'admin@salessavvy.com' && credentials.password === 'Admin@123')
    ) {
      const adminData = { username: 'admin', userId: 1, role: 'ADMIN' };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(adminData));
      return adminData;
    }

    if (
      (credentials.username === 'aka' && credentials.password === 'aka123@123') ||
      (credentials.username === 'aka@example.com' && credentials.password === 'aka123@123')
    ) {
      const custData = { username: 'aka', userId: 2, role: 'CUSTOMER' };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(custData));
      return custData;
    }

    // Custom login for new registered user in client mode
    const stored = localStorage.getItem('sales_savvy_registered_' + credentials.username);
    if (stored) {
      const reg = JSON.parse(stored);
      if (reg.password === credentials.password) {
        const uData = { username: reg.username, userId: reg.userId || 3, role: 'CUSTOMER' };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(uData));
        return uData;
      }
    }

    throw new Error('Invalid username or password');
  },

  logout: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem(DEMO_USER_KEY);
    return { message: 'Logged out successfully' };
  },

  getCurrentUser: async () => {
    // 1. Try Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return {
            username: user.user_metadata?.username || user.email?.split('@')[0],
            userId: user.id,
            role: user.user_metadata?.role || 'CUSTOMER',
          };
        }
      } catch (e) {}
    }

    // 2. Try Backend API
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.role) {
        return response.data;
      }
    } catch (e) {}

    // 3. Fallback to active session in localStorage
    const saved = localStorage.getItem(DEMO_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    throw new Error('Not authenticated');
  },

  register: async (userData) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const email = userData.email || `${userData.username}@salessavvy.com`;
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: userData.password,
          options: {
            data: {
              username: userData.username,
              role: 'CUSTOMER',
            },
          },
        });
        if (!error && data.user) {
          return { message: 'Registration successful! You can now log in.' };
        }
      } catch (e) {}
    }

    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (e) {
      // Fallback client registration
      localStorage.setItem('sales_savvy_registered_' + userData.username, JSON.stringify(userData));
      return { message: 'Registration successful! You can now log in.' };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (e) {
      const current = await authService.getCurrentUser();
      return {
        username: current.username,
        email: current.username + '@salessavvy.com',
        role: current.role,
      };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (e) {
      return { message: 'Profile updated', ...profileData };
    }
  },
};
