import { buildApiUrl, API_CONFIG } from '../config/api.config';

const API_BASE_URL = buildApiUrl('/api/parcelas-sql');

export interface ParcelaSQL {
  id: number;
  nombre: string;
  parcelaMg_Id: string;
  id_usuario?: number;
  fecha_creacion: string;
  borrado: boolean;
  Tbl_Usuarios?: {
    id: number;
    username: string;
    email: string;
    Tbl_Persona: {
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string;
    };
  };
}

// Tipo base para un sensor individual
interface SensorReading {
  value: number;
  unit: string;
  timestamp: string;
  coords: { lat: number; lon: number };
  type: string;
}

export interface ParcelaWithResponsable {
  _id: string;
  coords: {
    lat: number;
    lon: number;
  };
  sensores: {
    temperatura?: SensorReading[];
    humedad?: SensorReading[];
    lluvia?: SensorReading[];
    radiacion_solar?: SensorReading[];
    [key: string]: SensorReading[] | undefined;
  };
  timestamp: string;
  isDeleted: boolean;
  sqlData: ParcelaSQL | null;
  hasResponsable: boolean;
  responsable: {
    id: number;
    username: string;
    email: string;
    persona: {
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string;
    } | null;
  } | null;
  nombre: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Obtener parcelas con responsables (MongoDB + SQL)
export const getParcelasWithResponsables = async (): Promise<ParcelaWithResponsable[]> => {
  try {
    const response = await fetch(buildApiUrl('/api/parcelas/with-responsables'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<ParcelaWithResponsable[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener parcelas con responsables:', error);
    throw error;
  }
};

// Obtener parcelas SQL para la tabla (solo las que tienen responsables)
export const getParcelasForTable = async () => {
  try {
    const response = await fetch(buildApiUrl('/api/parcelas-sql/table'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener parcelas para tabla:', error);
    throw error;
  }
};

// Obtener parcela SQL por ID de MongoDB
export const getParcelaSQLByMongoId = async (parcelaMg_Id: string): Promise<ParcelaSQL | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mongo/${parcelaMg_Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null; // No existe asociación
    }

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<ParcelaSQL> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al obtener parcela SQL por MongoDB ID:', error);
    throw error;
  }
};

// Crear o actualizar parcela SQL
export const createOrUpdateParcelaSQL = async (data: {
  parcelaMg_Id: string;
  nombre: string;
  id_usuario?: number;
}): Promise<ParcelaSQL> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<ParcelaSQL> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al crear/actualizar parcela SQL:', error);
    throw error;
  }
};

// Actualizar parcela SQL existente
export const updateParcelaSQL = async (id: number, data: {
  nombre?: string;
  id_usuario?: number;
}): Promise<ParcelaSQL> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<ParcelaSQL> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error al actualizar parcela SQL:', error);
    throw error;
  }
};

// Eliminar responsable de parcela (borrado lógico)
export const removeResponsableFromParcela = async (id: number, id_usuario?: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_usuario }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar responsable de parcela:', error);
    throw error;
  }
};