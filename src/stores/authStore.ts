import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { User, UserRole, LoginRequest, SignupRequest } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const role = response.roles[0]?.replace('ROLE_', '') as UserRole;
          
          const user: User = {
            id: response.id,
            username: response.username,
            teamName: response.teamName,
            role,
          };
          
          // Store token in localStorage
          localStorage.setItem('auth-token', response.token);
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false 
          });
          throw error;
        }
      },
      
      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authService.signup(data);
          set({ isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('auth-token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      fetchCurrentUser: async () => {
        const token = get().token || localStorage.getItem('auth-token');
        if (!token) {
          get().logout();
          return;
        }
        
        set({ isLoading: true });
        try {
          const user = await authService.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          get().logout();
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
