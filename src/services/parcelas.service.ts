import { buildApiUrl, API_CONFIG } from '../config/api.config';
import type { Parcela, ApiResponse } from '../types';
import { SweetAlert } from '../components/custom/SweetAlert';

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.PARCELAS_SQL);

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

// ==================== MÉTODOS CON ALERTAS INTEGRADAS ====================

export const createParcelaWithAlert = async (parcelaData: {
  nombre: string;
  latitud: string;
  longitud: string;
  id_usuario: number;
}): Promise<Parcela | null> => {
  try {
    SweetAlert.showLoading({
      title: 'Creando parcela...',
      text: 'Por favor espera un momento',
    });

    const parcela = await createParcela(parcelaData);
    
    SweetAlert.closeLoading();
    await SweetAlert.successCreate('La parcela');
    
    return parcela;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('crear la parcela', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
};

export const updateParcelaWithAlert = async (
  id: number,
  parcelaData: Partial<Omit<Parcela, 'id' | 'fecha_creacion' | 'borrado'>>,
  parcelaName?: string
): Promise<Parcela | null> => {
  try {
    SweetAlert.showLoading({
      title: 'Actualizando parcela...',
      text: 'Por favor espera un momento',
    });

    const parcela = await updateParcela(id, parcelaData);
    
    SweetAlert.closeLoading();
    await SweetAlert.successUpdate(`La parcela ${parcelaName || ''}`);
    
    return parcela;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('actualizar la parcela', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
};

export const deleteParcelaWithAlert = async (id: number, parcelaName?: string): Promise<boolean> => {
  try {
    const result = await SweetAlert.confirmDelete(parcelaName ? `la parcela "${parcelaName}"` : 'esta parcela');
    
    if (result.isConfirmed) {
      SweetAlert.showLoading({
        title: 'Eliminando parcela...',
        text: 'Por favor espera un momento',
      });

      await deleteParcela(id);
      
      SweetAlert.closeLoading();
      await SweetAlert.successDelete(`La parcela ${parcelaName || ''}`);
      
      return true;
    }
    
    return false;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('eliminar la parcela', error instanceof Error ? error.message : 'Error desconocido');
    return false;
  }
};

export const assignParcelaToUsuarioWithAlert = async (
  parcelaId: number,
  usuarioId: number,
  parcelaName?: string,
  usuarioName?: string
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

      // Actualizar la parcela con el nuevo usuario asignado
      await updateParcela(parcelaId, { id_usuario: usuarioId });
      
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

export const unassignParcelaWithAlert = async (
  parcelaId: number,
  parcelaName?: string
): Promise<boolean> => {
  try {
    const result = await SweetAlert.confirm({
      title: '¿Desasignar parcela?',
      text: `Se desasignará ${parcelaName ? `la parcela "${parcelaName}"` : 'la parcela'} del usuario actual.`,
      icon: 'question',
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });
    
    if (result.isConfirmed) {
      SweetAlert.showLoading({
        title: 'Desasignando parcela...',
        text: 'Por favor espera un momento',
      });

      // Actualizar la parcela removiendo el usuario asignado
      await updateParcela(parcelaId, { id_usuario: undefined });
      
      SweetAlert.closeLoading();
      await SweetAlert.success({
        title: '¡Desasignada!',
        text: `${parcelaName ? `La parcela "${parcelaName}"` : 'La parcela'} ha sido desasignada exitosamente.`,
        timer: 2000,
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('desasignar la parcela', error instanceof Error ? error.message : 'Error desconocido');
    return false;
  }
};
