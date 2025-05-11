import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CorreoEditar, DatosUsuarioEditar, FotoPerfil } from '../interfaces/usuario';
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

  //ruta para obtener datos de usuario para mostrar por id
  //creado por david el 09/05
  obtenerDatosUsuario(idUsuario: number) {
    return this.http.get(`${this.baseUrl}/usuarios/${idUsuario}`).pipe();
  }

  //ruta para editar el correo
  //creado por david el 10/05
  editarCorreo(correoUsuario: CorreoEditar) {
    return this.http.patch(this.baseUrl + "/usuarios/editar-correo", correoUsuario).pipe();
  }

}