//interfaces de Eventos
//creada por Andrea el 30/04

//interfaz para crear eventos
export interface Evento {
    usuarioId: number;
    nombre: string;
    descripcion: string;
    fechaHora: string; // tipo ISO: "2025-05-21T10:30:00"
    tipoEvento: number;
}
