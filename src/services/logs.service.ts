import { buildApiUrl } from '../config/api.config';

export interface LogEntry {
  id_log?: string | bigint;
  id?: string | bigint; // Alias para compatibilidad
  id_usuario?: number;
  accion: string;
  descripcion?: string;
  entidad?: string;
  id_entidad_afectada?: number;
  ip_origen?: string;
  user_agent?: string;
  fecha?: string;
  fecha_creacion?: string; // Alias para compatibilidad
  Tbl_Usuarios?: {
    id: number;
    username: string;
    email: string;
    Tbl_Persona?: {
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Obtener historial de parcelas eliminadas
export const getParcelasEliminadas = async (limit: number = 50): Promise<LogEntry[]> => {
  try {
    const response = await fetch(buildApiUrl(`/api/logs/parcelas-eliminadas?limit=${limit}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<LogEntry[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener historial de parcelas eliminadas:', error);
    throw error;
  }
};

// Obtener todos los logs
export const getAllLogs = async (limit?: number): Promise<LogEntry[]> => {
  try {
    const url = limit 
      ? buildApiUrl(`/api/logs?limit=${limit}`)
      : buildApiUrl('/api/logs');
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<LogEntry[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener logs:', error);
    throw error;
  }
};

// Obtener logs por usuario
export const getLogsByUsuario = async (id_usuario: number, limit?: number): Promise<LogEntry[]> => {
  try {
    const url = limit 
      ? buildApiUrl(`/api/logs/usuario/${id_usuario}?limit=${limit}`)
      : buildApiUrl(`/api/logs/usuario/${id_usuario}`);
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<LogEntry[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener logs del usuario:', error);
    throw error;
  }
};

// Obtener logs por acción
export const getLogsByAccion = async (accion: string, limit?: number): Promise<LogEntry[]> => {
  try {
    const url = limit 
      ? buildApiUrl(`/api/logs/accion/${accion}?limit=${limit}`)
      : buildApiUrl(`/api/logs/accion/${accion}`);
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<LogEntry[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener logs por acción:', error);
    throw error;
  }
};