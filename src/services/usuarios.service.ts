// Servicio para manejar todas las peticiones relacionadas con Usuarios
import { buildApiUrl, API_CONFIG } from "../config/api.config";
import type { Usuario, ApiResponse } from "../types";

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS);

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Usuario[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Usuario> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

export const createUsuario = async (usuarioData: {
  username: string;
  password: string;
  email: string;
  id_role: number;
  id_persona: number;
}): Promise<Usuario> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Usuario> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const updateUsuario = async (
  id: number,
  usuarioData: Partial<Omit<Usuario, "id" | "borrado" | "fecha_creacion">>
): Promise<Usuario> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Usuario> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

export const deleteUsuario = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    console.log(`Usuario con ID ${id} eliminado correctamente`);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};
