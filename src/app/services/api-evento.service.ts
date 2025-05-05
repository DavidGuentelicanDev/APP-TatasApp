import { Injectable } from '@angular/core';
//importa clase http para peticiones hacia un servidor API //Andrea //16/04/2025
import { HttpClient } from '@angular/common/http';
import { environmentLocal } from '../config.local';
import { Evento } from '../interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class ApiEventoService {

  private baseUrl = environmentLocal.URLbase;

  constructor(
    private http: HttpClient
  ) { }

  //metodo para crear un evento
  //creado por Andrea el 30/04/2025
  //corregido por David el 01/05/2025
  crearEvento(evento: Evento) {
    //payload para el envio de datos a la api
    const payload = {
      usuario_id: evento.usuarioId,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha_hora: evento.fechaHora,
      tipo_evento: evento.tipoEvento
    };

    return this.http.post(this.baseUrl + '/eventos/crear-evento', payload).pipe();
  }

}
