export interface Parcela {
  id?: number;
  latitud: string;
  longitud: string;
  nombre: string;
  id_usuario: number;
  fecha_creacion?: string;
  borrado?: boolean;
}
