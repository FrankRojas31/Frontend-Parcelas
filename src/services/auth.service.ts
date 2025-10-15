import { API_CONFIG } from '../config/api.config';

// Interfaces para las peticiones
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  direccion: string;
  fecha_nacimiento: string;
}

// Interfaces para las respuestas de la API real
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    usuario?: {
      id: number;
      username: string;
      email: string;
      id_role: number;
      id_persona: number;
      Tbl_Roles: {
        id: number;
        nombre: string;
      };
      Tbl_Persona: {
        id: number;
        nombre: string;
        apellido_paterno: string;
        apellido_materno: string;
        telefono: string;
        direccion: string;
        fecha_nacimiento: string | null;
      };
    };
    token?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Servicio para iniciar sesión
 */
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/login/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el servidor');
    }

    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Servicio para registrar un nuevo usuario
 */
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/register/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el servidor');
    }

    return data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

/**
 * Servicio para verificar el token
 */
export const verifyToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token inválido');
    }

    return data;
  } catch (error) {
    console.error('Error al verificar token:', error);
    throw error;
  }
};

/**
 * Servicio para cerrar sesión
 */
export const logoutUser = async (token: string): Promise<void> => {
  try {
    await fetch(`${API_CONFIG.BASE_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error en logout:', error);
    // No lanzamos error aquí porque el logout local debe funcionar aunque falle el servidor
  }
};