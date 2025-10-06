import React, { useState, useMemo } from "react";
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
import { FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  parcelas: number;
  rol: string;
}

interface CrudUsuariosProps {
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

const usuariosDummy: Usuario[] = [
  { id: 1, nombre: "Martinez Lara Jose Moises", correo: "jose.martinez@gmail.com", parcelas: 4, rol: "Administrador" },
  { id: 2, nombre: "García Pérez Ana Sofía", correo: "ana.garcia@outlook.com", parcelas: 12, rol: "Supervisor" },
  { id: 3, nombre: "López Hernández Carlos Eduardo", correo: "carlos.lopez@yahoo.com", parcelas: 6, rol: "Usuario" },
  { id: 4, nombre: "Rodríguez Silva María Elena", correo: "maria.rodriguez@gmail.com", parcelas: 2, rol: "Usuario" },
  { id: 5, nombre: "González Morales Pedro Antonio", correo: "pedro.gonzalez@hotmail.com", parcelas: 8, rol: "Supervisor" },
  { id: 6, nombre: "Fernández Castro Lucía Beatriz", correo: "lucia.fernandez@gmail.com", parcelas: 3, rol: "Usuario" },
  { id: 7, nombre: "Sánchez Ruiz Miguel Ángel", correo: "miguel.sanchez@outlook.com", parcelas: 15, rol: "Administrador" },
  { id: 8, nombre: "Torres Jiménez Carmen Rosa", correo: "carmen.torres@gmail.com", parcelas: 7, rol: "Usuario" },
  { id: 9, nombre: "Moreno Vargas David Alejandro", correo: "david.moreno@yahoo.com", parcelas: 5, rol: "Supervisor" },
  { id: 10, nombre: "Ramírez Ortega Isabel Cristina", correo: "isabel.ramirez@hotmail.com", parcelas: 9, rol: "Usuario" },
  { id: 11, nombre: "Cruz Mendoza Roberto Carlos", correo: "roberto.cruz@gmail.com", parcelas: 11, rol: "Administrador" },
  { id: 12, nombre: "Vásquez Luna Andrea Paola", correo: "andrea.vasquez@outlook.com", parcelas: 1, rol: "Usuario" },
];


const CrudUsuarios: React.FC<CrudUsuariosProps> = ({ onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsuarios = useMemo(() => {
    return usuariosDummy.filter(usuario =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calcular usuarios para la página actual
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(startIndex, startIndex + itemsPerPage);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-6">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
        <TableHeader>
          <TableRow className="bg-lime-600 hover:bg-lime-700">
            <TableHead className="text-white font-bold">Nombre</TableHead>
            <TableHead className="text-white font-bold">Correo</TableHead>
            <TableHead className="text-white font-bold text-center">Parcelas</TableHead>
            <TableHead className="text-white font-bold">Rol</TableHead>
            <TableHead className="text-white font-bold text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsuarios.map((usuario) => (
            <TableRow key={usuario.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{usuario.nombre}</TableCell>
              <TableCell>{usuario.correo}</TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {usuario.parcelas}
                </span>
              </TableCell>
              <TableCell>
                <span className={
                  `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    usuario.rol === 'Administrador'
                      ? 'bg-blue-100 text-blue-800'
                      : usuario.rol === 'Supervisor'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`
                }>
                  {usuario.rol}
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
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-900 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
                    }`}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      size="default"
                      onClick={() => goToPage(page)}
                      className={`cursor-pointer ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-900 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-500">Intenta con diferentes términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default CrudUsuarios;