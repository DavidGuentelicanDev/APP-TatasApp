//interfaz para crear alertas
//creado por david el 07/05
export interface Alerta {
    usuario_id: number;
    ubicacion: string;
    mensaje: string;
    tipo_alerta: number
}