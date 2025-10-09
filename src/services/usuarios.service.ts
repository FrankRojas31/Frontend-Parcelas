// Servicio para manejar todas las peticiones relacionadas con Usuarios
import { buildApiUrl, API_CONFIG } from "../config/api.config";
import type { Usuario, ApiResponse } from "../types";
import { SweetAlert } from "../components/custom/SweetAlert";

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

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// ==================== MÉTODOS CON ALERTAS INTEGRADAS ====================

export const createUsuarioWithAlert = async (usuarioData: {
  username: string;
  password: string;
  email: string;
  id_role: number;
  id_persona: number;
}): Promise<Usuario | null> => {
  try {
    SweetAlert.showLoading({
      title: 'Creando usuario...',
      text: 'Por favor espera un momento',
    });

    const usuario = await createUsuario(usuarioData);
    
    SweetAlert.closeLoading();
    await SweetAlert.successCreate('El usuario');
    
    return usuario;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('crear el usuario', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
};

export const updateUsuarioWithAlert = async (
  id: number,
  usuarioData: Partial<Omit<Usuario, "id" | "borrado" | "fecha_creacion">>,
  username?: string
): Promise<Usuario | null> => {
  try {
    SweetAlert.showLoading({
      title: 'Actualizando usuario...',
      text: 'Por favor espera un momento',
    });

    const usuario = await updateUsuario(id, usuarioData);
    
    SweetAlert.closeLoading();
    await SweetAlert.successUpdate(`El usuario ${username || ''}`);
    
    return usuario;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('actualizar el usuario', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
};

export const deleteUsuarioWithAlert = async (id: number, username?: string): Promise<boolean> => {
  try {
    const result = await SweetAlert.confirmDelete(username ? `el usuario "${username}"` : 'este usuario');
    
    if (result.isConfirmed) {
      SweetAlert.showLoading({
        title: 'Eliminando usuario...',
        text: 'Por favor espera un momento',
      });

      await deleteUsuario(id);
      
      SweetAlert.closeLoading();
      await SweetAlert.successDelete(`El usuario ${username || ''}`);
      
      return true;
    }
    
    return false;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('eliminar el usuario', error instanceof Error ? error.message : 'Error desconocido');
    return false;
  }
};

export const assignParcelaToUsuarioWithAlert = async (
  usuarioId: number,
  parcelaId: number,
  usuarioName?: string,
  parcelaName?: string
): Promise<boolean> => {
  try {
    const result = await SweetAlert.confirmAssign(
      parcelaName ? `la parcela "${parcelaName}"` : 'la parcela',
      usuarioName ? `el usuario "${usuarioName}"` : 'el usuario'
    );
    
    if (result.isConfirmed) {
      SweetAlert.showLoading({
        title: 'Asignando parcela...',
        text: 'Por favor espera un momento',
      });

      // Aquí puedes llamar a la función de asignación cuando esté disponible
      // await assignParcelaToUsuario(usuarioId, parcelaId);
      
      SweetAlert.closeLoading();
      await SweetAlert.successAssign(
        parcelaName ? `la parcela "${parcelaName}"` : 'la parcela',
        usuarioName ? `el usuario "${usuarioName}"` : 'el usuario'
      );
      
      return true;
    }
    
    return false;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('asignar la parcela', error instanceof Error ? error.message : 'Error desconocido');
    return false;
  }
};
