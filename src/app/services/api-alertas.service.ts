import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentLocal } from '../config.local';
import { Alerta, AlertasPendientes, EstadoAlertaResponse } from '../interfaces/alerta';
import { UsuariosPorId } from '../interfaces/usuario';
import { firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiAlertasService {

  private baseUrl = environmentLocal.URLbase;

  constructor(
    private http: HttpClient
  ) { }

  //servicio para obtener registro de alertas
  //creado por ale 04-05-2025
  //modificado por david el 08/05: se modifica la ruta a la nueva ruta para historial (estado alerta 1)
  getAlertasPorFamiliar(idFamiliar: number): Observable<AlertasPendientes[]> {
    const ruta = `${this.baseUrl}/alertas/obtener-alertas-historial/${idFamiliar}`;
    return this.http.get<AlertasPendientes[]>(ruta);
  }

  //ruta para obtener los usuarios por id de usuario
  //creado por ale el 04/05
  //trasladado por david el 07/05
  obtenerUsuariosPorId(idUsuario: number): Promise<UsuariosPorId | undefined> {
    return this.http.get<UsuariosPorId>(`${this.baseUrl}/usuarios/${idUsuario}`).toPromise()
    .catch(err => {
      console.error("tatas Error al obtener usuario:", err);
      return undefined;
    });
  }

  //ruta para crear alertas
  //creado por ale el 04/05
  //trasladado por david el 07/05
  crearAlerta(alerta: Alerta): Promise<any> {
    return this.http.post(`${this.baseUrl}/alertas/crear-alerta`, alerta).toPromise();
  }

  //ruta para consultar activamente las alertas en estado 0 (pendientes) del adulto mayor
  //creada por david el 07/05
  obtenerAlertasPendientes(idFamiliar: number): Observable<AlertasPendientes[]> {
    const ruta = `${this.baseUrl}/alertas/obtener-alertas-pendientes/${idFamiliar}`;
    return this.http.get<AlertasPendientes[]>(ruta);
  }

  //ruta para actualizar el estado de la alerta recibida a 1 (recibida o entregada)
  //creado por david el 08/05
  actualizarEstadoAlerta(idAlerta: number): Promise<EstadoAlertaResponse> {
    const ruta = `${this.baseUrl}/alertas/actualizar-estado`;
    let body = {
      id: idAlerta,
      estado_alerta: 1 //siempre cambiará a ese estado
    }
    return firstValueFrom(this.http.patch<EstadoAlertaResponse>(ruta, body));
  }

}