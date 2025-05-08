import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentLocal } from '../config.local';
import { Alerta } from '../interfaces/alerta';
import { UsuariosPorId } from '../interfaces/usuario';


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
  getAlertasPorFamiliar(idFamiliar: number): Promise<any> {
    return this.http.get(`${this.baseUrl}/alertas/obtener-alertas-pendientes/${idFamiliar}`).toPromise();
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

}