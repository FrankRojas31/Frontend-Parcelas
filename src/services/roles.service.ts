import { buildApiUrl, API_CONFIG } from "../config/api.config";
import type { Rol, ApiResponse } from "../types";
import { SweetAlert } from "../components/custom/SweetAlert";

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.ROLES);

export const getAllRoles = async (): Promise<Rol[]> => {
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

    const result: ApiResponse<Rol[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};
