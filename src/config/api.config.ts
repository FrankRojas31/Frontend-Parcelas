
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    PARCELAS: '/api/parcelas-sql',
    USUARIOS: '/api/usuarios',
    ROLES: '/api/roles',
    PERSONAS: '/api/personas',
    LOGS: '/api/logs',
  }
};

export const buildApiUrl = (endpoint: string, path?: string): string => {
  const base = `${API_CONFIG.BASE_URL}${endpoint}`;
  return path ? `${base}${path}` : base;
};
