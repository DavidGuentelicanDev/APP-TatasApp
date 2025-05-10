import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatosUsuarioEditar, FotoPerfil } from '../interfaces/usuario';
import { environmentLocal } from '../config.local';


@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private baseUrl = environmentLocal.URLbase;

  constructor(
    private http: HttpClient
  ) {}

  //ruta para editar foto-perfil
  //creado por david el 09/05
  editarFotoPerfil(fotoPerfil: FotoPerfil) {
    return this.http.patch(this.baseUrl + "/usuarios/editar-foto-perfil", fotoPerfil).pipe();
  }

  //ruta para obtener la foto de perfil guardada
  //creado por david el 09/05
  obtenerFotoPerfil(idUsuario: number) {
    return this.http.get(`${this.baseUrl}/usuarios/foto-perfil/${idUsuario}`).pipe();
  }

  //ruta para editar datos de usuario (nombres, apellidos, fecha nacimiento, telefono, direccion completa)
  //creado por david el 09/05
  editarDatosUsuario(datosUsuario: DatosUsuarioEditar) {
    return this.http.patch(this.baseUrl + "/usuarios/editar-datos", datosUsuario).pipe();
  }

  //obtener datos de usuario para mostrar por id
  obtenerDatosUsuario(idUsuario: number) {
    return this.http.get(`${this.baseUrl}/usuarios/${idUsuario}`).pipe();
  }

}