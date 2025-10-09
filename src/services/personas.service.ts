// Servicio para manejar todas las peticiones relacionadas con Personas
import { buildApiUrl, API_CONFIG } from "../config/api.config";
import type { Persona, ApiResponse } from "../types";
import { SweetAlert } from "../components/custom/SweetAlert";

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.PERSONAS);

export const createPersona = async (
  personaData: Omit<Persona, "id" | "borrado" | "fecha_creacion">
): Promise<Persona> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personaData),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Persona> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al crear la persona:", error);
    throw error;
  }
};

export const updatePersona = async (
  id: number,
  personaData: Omit<Persona, "id" | "borrado" | "fecha_creacion">
): Promise<Persona> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personaData),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result: ApiResponse<Persona> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
    throw error;
  }
};


export const createPersonaWithAlert = async (
  personaData: Omit<Persona, "id" | "borrado" | "fecha_creacion">
): Promise<Persona | null> => {
  try {
    SweetAlert.showLoading({
      title: 'Creando persona...',
      text: 'Por favor espera un momento',
    });

    const persona = await createPersona(personaData);
    
    SweetAlert.closeLoading();
    await SweetAlert.successCreate('La persona');
    
    return persona;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('crear la persona', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
};

export const updatePersonaWithAlert = async (
  id: number,
  personaData: Omit<Persona, "id" | "borrado" | "fecha_creacion">,
  personaName?: string
): Promise<Persona | null> => {
  try {
    SweetAlert.showLoading({
      title: 'Actualizando persona...',
      text: 'Por favor espera un momento',
    });

    const persona = await updatePersona(id, personaData);
    
    SweetAlert.closeLoading();
    await SweetAlert.successUpdate(`La persona ${personaName || ''}`);
    
    return persona;
  } catch (error) {
    SweetAlert.closeLoading();
    await SweetAlert.errorOperation('actualizar la persona', error instanceof Error ? error.message : 'Error desconocido');
    return null;
  }
};
