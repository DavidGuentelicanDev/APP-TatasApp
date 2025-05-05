import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FamiliarRegistrado, FamiliarRegistro } from '../interfaces/familiar';
import { environmentLocal } from '../config.local';

@Injectable({
  providedIn: 'root'
})
export class ApiFamiliaresService {

  private baseUrl = environmentLocal.URLbase;

  constructor(
    private http: HttpClient
  ) { }

  // AHORA RETORNA UN ARRAY de familiares registrados
  obtenerContactosFamiliar(): Observable<FamiliarRegistrado[]> {
    return this.http.get<FamiliarRegistrado[]>(this.baseUrl + "/usuarios/contactos-registrados");
  }

  //ruta para registrar un familiar
  registrarFamiliar(familiar: FamiliarRegistro) {
    //payload para la api
    let payload = {
      adulto_mayor_id: familiar.idAdultoMayor,
      familiar_id: familiar.idFamiliar
    }
    return this.http.post(this.baseUrl + "/familiares/registrar-familiar", payload).pipe(); 
  }

}