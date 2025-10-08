export interface Rol {
  id: number;
  nombre: string;
  borrado: boolean;
}

export interface Persona {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono?: string | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
  borrado: boolean;
  fecha_creacion?: string;
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  password?: string;
  id_role: number;
  id_persona: number;
  borrado?: boolean;
  fecha_creacion?: string;

  // Relaciones
  Tbl_Roles?: Rol;
  Tbl_Persona?: Persona;
  Tbl_Parcelas?: any[]; // puedes tiparlo después si los usas
  Tbl_Logs?: any[];
}
