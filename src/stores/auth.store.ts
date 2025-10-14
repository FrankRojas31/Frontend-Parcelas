import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, verifyToken, logoutUser } from '../services/auth.service';

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface AuthState {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;

  // Acciones
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,

      // Acciones
      login: async (credentials) => {
        try {
          set({ isLoading: true });

          const response = await loginUser(credentials);

          if (response.success && response.data?.token && response.data?.usuario) {
            const apiUser = response.data.usuario;
            const user: User = {
              id: apiUser.id.toString(),
              username: apiUser.username,
              email: apiUser.email,
              role: apiUser.Tbl_Roles.nombre
            };

            set({
              isAuthenticated: true,
              user,
              token: response.data.token,
              isLoading: false
            });

            // Guardar en localStorage también para compatibilidad
            localStorage.setItem('token', response.data.token);

            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Error en login:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        const currentToken = localStorage.getItem('token');
        
        if (currentToken) {
          try {
            await logoutUser(currentToken);
          } catch (error) {
            console.error('Error en logout del servidor:', error);
          }
        }

        set({
          isAuthenticated: false,
          user: null,
          token: null
        });
        
        // Limpiar localStorage
        localStorage.removeItem('token');
      },

      setUser: (user) => {
        set({ user });
      },

      setToken: (token) => {
        set({ token });
        localStorage.setItem('token', token);
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await verifyToken(token);
            if (response.success && response.data?.usuario) {
              const apiUser = response.data.usuario;
              const user: User = {
                id: apiUser.id.toString(),
                username: apiUser.username,
                email: apiUser.email,
                role: apiUser.Tbl_Roles.nombre
              };

              set({
                isAuthenticated: true,
                user,
                token
              });
            } else {
              // Token inválido, limpiar estado
              set({
                isAuthenticated: false,
                user: null,
                token: null
              });
              localStorage.removeItem('token');
            }
          } catch (error) {
            console.error('Error al verificar token:', error);
            // Token inválido o error de red, limpiar estado
            set({
              isAuthenticated: false,
              user: null,
              token: null
            });
            localStorage.removeItem('token');
          }
        } else {
          set({
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      }
    }),
    {
      name: 'auth-storage', // nombre para localStorage
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token 
      })
    }
  )
);