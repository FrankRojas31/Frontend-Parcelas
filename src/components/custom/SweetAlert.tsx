import Swal from 'sweetalert2';
import type { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

// Tipos para las diferentes opciones de alertas
export interface AlertOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  html?: string;
  timer?: number;
}

export interface ConfirmOptions extends AlertOptions {
  showCancelButton: true;
}

export interface LoadingOptions {
  title: string;
  text?: string;
  allowOutsideClick?: boolean;
}

export interface ToastOptions {
  title: string;
  icon: SweetAlertIcon;
  timer?: number;
}

class SweetAlertService {
  // Configuración por defecto
  private defaultOptions = {
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#EF4444',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  };

  // Alerta simple de información
  async info(options: AlertOptions): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      icon: 'info',
      ...options,
    });
  }

  // Alerta de éxito
  async success(options: AlertOptions): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      icon: 'success',
      ...options,
    });
  }

  // Alerta de error
  async error(options: AlertOptions): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      icon: 'error',
      ...options,
    });
  }

  // Alerta de advertencia
  async warning(options: AlertOptions): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      icon: 'warning',
      ...options,
    });
  }

  // Alerta de confirmación
  async confirm(options: ConfirmOptions): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      icon: 'question',
      ...options,
    });
  }

  // Alerta de confirmación para eliminar
  async confirmDelete(itemName: string = 'este elemento'): Promise<SweetAlertResult> {
    return await this.confirm({
      title: '¿Estás seguro?',
      text: `Se eliminará ${itemName}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      showCancelButton: true,
    });
  }

  // Alerta de confirmación para asignar
  async confirmAssign(itemName: string, targetName: string): Promise<SweetAlertResult> {
    return await this.confirm({
      title: '¿Confirmar asignación?',
      text: `Se asignará ${itemName} a ${targetName}.`,
      icon: 'question',
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });
  }

  // Alerta de carga/loading
  showLoading(options: LoadingOptions): void {
    Swal.fire({
      title: options.title,
      text: options.text,
      allowOutsideClick: options.allowOutsideClick ?? false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // Cerrar la alerta de loading
  closeLoading(): void {
    Swal.close();
  }

  // Toast notification
  toast(options: ToastOptions): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: options.timer ?? 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: options.icon,
      title: options.title,
    });
  }

  // Métodos de conveniencia para operaciones CRUD
  async successCreate(itemName: string = 'elemento'): Promise<SweetAlertResult> {
    return await this.success({
      title: '¡Creado!',
      text: `${itemName} ha sido creado exitosamente.`,
      timer: 2000,
    });
  }

  async successUpdate(itemName: string = 'elemento'): Promise<SweetAlertResult> {
    return await this.success({
      title: '¡Actualizado!',
      text: `${itemName} ha sido actualizado exitosamente.`,
      timer: 2000,
    });
  }

  async successDelete(itemName: string = 'elemento'): Promise<SweetAlertResult> {
    return await this.success({
      title: '¡Eliminado!',
      text: `${itemName} ha sido eliminado exitosamente.`,
      timer: 2000,
    });
  }

  async successAssign(itemName: string, targetName: string): Promise<SweetAlertResult> {
    return await this.success({
      title: '¡Asignado!',
      text: `${itemName} ha sido asignado a ${targetName} exitosamente.`,
      timer: 2000,
    });
  }

  async errorOperation(operation: string, error?: string): Promise<SweetAlertResult> {
    return await this.error({
      title: `Error al ${operation}`,
      text: error || 'Ha ocurrido un error inesperado. Intenta nuevamente.',
    });
  }

  // Input con SweetAlert
  async inputText(options: {
    title: string;
    text?: string;
    placeholder?: string;
    inputValue?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      input: 'text',
      inputPlaceholder: options.placeholder || '',
      inputValue: options.inputValue || '',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
      title: options.title,
      text: options.text,
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
        return null;
      },
    });
  }

  // Select con SweetAlert
  async selectOption(options: {
    title: string;
    text?: string;
    inputOptions: Record<string, string>;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<SweetAlertResult> {
    return await Swal.fire({
      ...this.defaultOptions,
      input: 'select',
      inputOptions: options.inputOptions,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
      title: options.title,
      text: options.text,
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar una opción';
        }
        return null;
      },
    });
  }
}

// Instancia singleton del servicio
export const SweetAlert = new SweetAlertService();

// Export por defecto para facilitar la importación
export default SweetAlert;