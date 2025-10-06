import { buildApiUrl, API_CONFIG } from '../config/api.config';
import type { Parcela, ApiResponse } from '../types';

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.PARCELAS);

export const getAllParcelas = async (): Promise<Parcela[]> => {
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

    const result: ApiResponse<Parcela[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener parcelas:', error);
    throw error;
  }
};

// Obtener parcela por ID
export const getParcelaById = async (id: number): Promise<Parcela> => {
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

    const result: ApiResponse<Parcela> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener parcela:', error);
    throw error;
  }
};

export const getParcelasByUsuario = async (id_usuario: number): Promise<Parcela[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario/${id_usuario}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Parcela[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener parcelas del usuario:', error);
    throw error;
  }
};

export const searchParcelasByName = async (nombre: string): Promise<Parcela[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${nombre}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Parcela[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al buscar parcelas:', error);
    throw error;
  }
};

export const createParcela = async (parcela: Omit<Parcela, 'id' | 'fecha_creacion' | 'borrado'>): Promise<Parcela> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parcela),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Parcela> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al crear parcela:', error);
    throw error;
  }
};

export const updateParcela = async (
  id: number,
  parcela: Partial<Omit<Parcela, 'id' | 'fecha_creacion' | 'borrado'>>
): Promise<Parcela> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parcela),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Parcela> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al actualizar parcela:', error);
    throw error;
  }
};

export const deleteParcela = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error('Error al eliminar parcela:', error);
    throw error;
  }
};
