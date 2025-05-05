import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentLocal } from '../config.local';

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

}