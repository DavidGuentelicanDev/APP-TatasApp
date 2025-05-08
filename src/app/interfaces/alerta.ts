//interfaz para crear alertas
//creado por david el 07/05
export interface Alerta {
    usuario_id: number;
    ubicacion: string;
    mensaje: string;
    tipo_alerta: number
}

//interfaz para obtener las aleras pendientes (estado 0)
//creado por david el 07/05
export interface AlertasPendientes {
    id: number;
    usuario_id: number;
    ubicacion: string;
    mensaje: string;
    tipo_alerta: number;
    fecha_hora: Date;
    estado_alerta: number;
}