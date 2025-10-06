export interface Usuario {
  id: number;
  username: string;
  email: string;
  id_role: number;
  id_persona: number;
  borrado?: boolean;
  fecha_creacion?: string;
}
