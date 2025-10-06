// Servicio para manejar todas las peticiones relacionadas con Usuarios
import { buildApiUrl, API_CONFIG } from '../config/api.config';
import type { Usuario, ApiResponse } from '../types';

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS);

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Usuario[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Usuario> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};
