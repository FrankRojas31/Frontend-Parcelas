// Servicio para manejar todas las peticiones relacionadas con Personas
import { buildApiUrl, API_CONFIG } from "../config/api.config";
import type { Persona, ApiResponse } from "../types";

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
