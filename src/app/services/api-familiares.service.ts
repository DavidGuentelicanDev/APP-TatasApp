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
  //creado por david el 02/05
  registrarFamiliar(familiar: FamiliarRegistro) {
    //payload para la api
    let payload = {
      adulto_mayor_id: familiar.idAdultoMayor,
      familiar_id: familiar.idFamiliar
    }
    return this.http.post(this.baseUrl + "/familiares/registrar-familiar", payload).pipe(); 
  }

  //ruta para obtener los familiares registrados por el adulto mayor
  //creado por david el 07/05
  obtenerFamiliaresRegistrados(idAdultoMayor: number): Observable<FamiliarRegistrado[]> {
    const url = `${this.baseUrl}/familiares/familiares-adulto-mayor/${idAdultoMayor}`;
    return this.http.get<FamiliarRegistrado[]>(url);
  }

  //ruta para eliminar un familiar por parte del adulto mayor
  //creado por david el 07/05
  eliminarFamiliar(idAdultoMayor: number, idFamiliar: number) {
    return this.http.delete(`${this.baseUrl}/familiares/eliminar-familiar/${idAdultoMayor}/${idFamiliar}`).pipe();
  }

}