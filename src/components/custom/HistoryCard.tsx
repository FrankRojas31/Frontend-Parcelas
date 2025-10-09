import { useState, useEffect } from "react";
import { getParcelasEliminadas, type LogEntry } from "../../services/logs.service";

interface HistoryCardProps {
  className?: string;
}

function HistoryCard({ className = "" }: HistoryCardProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchHistorial();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchHistorial, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getParcelasEliminadas(10); // Últimos 10 registros para el dashboard
      setLogs(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError("Error al cargar el historial de parcelas eliminadas");
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUsuarioInfo = (log: LogEntry) => {
    if (log.Tbl_Usuarios) {
      const persona = log.Tbl_Usuarios.Tbl_Persona;
      if (persona) {
        return `${persona.nombre} ${persona.apellido_paterno}`;
      }
      return log.Tbl_Usuarios.username;
    }
    return 'Sistema';
  };

  return (
    <div className={`bg-white/20 backdrop-blur-md  rounded-xl p-6 shadow-lg flex-1 min-w-[320px] ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {lastUpdate && (
            <span className="text-xs text-black-500">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchHistorial}
            disabled={loading}
            className="p-1 text-white-400 hover:text-black-600 disabled:opacity-50"
            title="Refrescar"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {logs.length === 0 && !loading ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No hay parcelas eliminadas</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-black-800 font-medium truncate">
                  {log.descripcion || 'Parcela eliminada'}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-black-500">
                    {getUsuarioInfo(log)}
                  </p>
                  <p className="text-xs text-black-500">
                    {formatFecha(log.fecha_creacion)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-center">
            <span className="text-xs text-gray-500">
              Últimas {logs.length} eliminaciones • Actualización automática
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryCard;
