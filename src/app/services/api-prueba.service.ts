import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environmentLocal } from '../config.local';

@Injectable({
  providedIn: 'root'
})
export class ApiPruebaService {

  private baseUrl = environmentLocal.URLbase;

  constructor(
    private http: HttpClient, //dependencia para conectar la api
  ) { }

  //ruta raiz de la api (solo para probar conexion)
  obtenerRutaRaiz() {
    return this.http.get(this.baseUrl + "/").pipe();
  }

}
