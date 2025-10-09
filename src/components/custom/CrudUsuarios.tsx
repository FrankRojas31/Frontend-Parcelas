import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { getAllUsuarios } from "../../services/usuarios.service";
import type { Usuario } from "../../types";

interface CrudUsuariosProps {
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  reload?: boolean;
}

const CrudUsuarios: React.FC<CrudUsuariosProps> = ({
  onEdit,
  onDelete,
  reload,
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getAllUsuarios();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Obtener usuarios al montar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Recargar usuarios cuando reload cambie
  useEffect(() => {
    if (reload) fetchUsuarios();
  }, [reload]);

  // Filtrado de usuarios (nombre, correo, rol)
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((usuario) => {
      const nombreCompleto = usuario.Tbl_Persona
        ? `${usuario.Tbl_Persona.nombre} ${usuario.Tbl_Persona.apellido_paterno} ${usuario.Tbl_Persona.apellido_materno}`
        : "";

      const correo = usuario.email || "";
      const rol = usuario.Tbl_Roles?.nombre || "";

      const term = searchTerm.toLowerCase();

      return (
        nombreCompleto.toLowerCase().includes(term) ||
        correo.toLowerCase().includes(term) ||
        rol.toLowerCase().includes(term)
      );
    });
  }, [usuarios, searchTerm]);

  // Calcular usuarios para la página actual
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="rounded-lg border bg-white/10 backdrop-blur-md  p-6">
      <div className="mb-6">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-white/70" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-white/30 rounded-md leading-5 bg-white/20 backdrop-blur-md placeholder-gray-300 text-white focus:outline-none focus:placeholder-white-400 focus:ring-1 focus:ring-white-500 focus:border-white-500 text-sm"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-lime-600 hover:bg-lime-700">
              <TableHead className="text-white font-bold">Nombre</TableHead>
              <TableHead className="text-white font-bold">Correo</TableHead>
              <TableHead className="text-white font-bold">Teléfono</TableHead>
              <TableHead className="text-white font-bold">Usuario</TableHead>
              <TableHead className="text-white font-bold">
                Fecha de creación
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                Parcelas
              </TableHead>
              <TableHead className="text-white font-bold">Rol</TableHead>
              <TableHead className="text-white font-bold text-center">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsuarios.map((usuario) => (
              <TableRow key={usuario.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {usuario.Tbl_Persona
                    ? `${usuario.Tbl_Persona.nombre} ${usuario.Tbl_Persona.apellido_paterno} ${usuario.Tbl_Persona.apellido_materno}`
                    : "—"}
                </TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.Tbl_Persona?.telefono}</TableCell>
                <TableCell>{usuario.username}</TableCell>
                <TableCell>
                  {usuario.fecha_creacion
                    ? new Date(usuario.fecha_creacion).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {usuario.Tbl_Parcelas?.length ?? 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      usuario.Tbl_Roles?.nombre === "Administrador"
                        ? "bg-blue-100 text-blue-800"
                        : usuario.Tbl_Roles?.nombre === "Supervisor"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {usuario.Tbl_Roles?.nombre || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                      title="Editar usuario"
                      onClick={() => onEdit(usuario)}
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                      title="Eliminar usuario"
                      onClick={() => onDelete(usuario)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsuarios.length > 0 ? (
        <div className="mt-6 flex items-center justify-between">
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    }`}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        size="default"
                        onClick={() => goToPage(page)}
                        className={`cursor-pointer ${
                          currentPage === page
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    }`}
                  >
                    Siguiente
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      ) : (
        <div className="mt-6 text-center py-8">
          <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-500">
            Intenta con diferentes términos de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
};

export default CrudUsuarios;
