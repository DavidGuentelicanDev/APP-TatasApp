import { Injectable } from '@angular/core';
//importa clase http para peticiones hacia un servidor API //Andrea //16/04/2025
import { HttpClient } from '@angular/common/http';
import { environmentLocal } from '../config.local';
import { Evento } from '../interfaces/evento';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  // método para obtener todos los eventos
  // creado por Andrea el 09/05/2025
  obtenerEventos(usuarioId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/eventos/listar`, {
      params: { usuario_id: usuarioId }
    });
  }

  // método para eliminar eventos
  // creado por Andrea el 09/05/2025
  eliminarEvento(id: number) {
    return this.http.delete(this.baseUrl + '/eventos/eliminar/' + id);
  }

  modificarEvento(id: number, evento: Evento) {
    return this.http.put(this.baseUrl + '/eventos/modificar/' + id, {
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha_hora: evento.fechaHora,
      tipo_evento: evento.tipoEvento
    });
  }

  obtenerEventosPorFamiliar(familiarId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/eventos/listar-por-familiar`, {
      params: { familiar_id: familiarId }
    });
  }

}