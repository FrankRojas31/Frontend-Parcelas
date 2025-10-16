
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    PARCELAS: '/api/parcelas',
    PARCELAS_SQL: '/api/parcelas-sql',
    PARCELAS_MONGO: '/api/parcelas-mongo',
    USUARIOS: '/api/usuarios',
    ROLES: '/api/roles',
    PERSONAS: '/api/personas',
    LOGS: '/api/logs',
    SENSORES: '/api/external/sensors',  // Endpoint para datos de sensores MongoDB
    AUTH: {
      LOGIN: '/api/login/login',
      REGISTER: '/api/register/register',
      VERIFY_TOKEN: '/api/verify-token',
      LOGOUT: '/api/logout'
    }
  }
};

export const buildApiUrl = (endpoint: string, path?: string): string => {
  const base = `${API_CONFIG.BASE_URL}${endpoint}`;
  return path ? `${base}${path}` : base;
};
