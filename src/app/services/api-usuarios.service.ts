import { Injectable } from '@angular/core';
//importa clase http para peticiones hacia un servidor API //Andrea //16/04/2025
import { HttpClient } from '@angular/common/http';
import { UsuarioLogin } from '../interfaces/usuario';
import { Direccion } from '../interfaces/direccion';
import { catchError, tap } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { environmentLocal } from '../config.local';

@Injectable({
  providedIn: 'root'
})
export class ApiUsuariosService {

  //URL de la API, puede cambiar
  private baseUrl = environmentLocal.URLbase;

  constructor(private http: HttpClient , private alertController: AlertController) { }

  registrar_usuario(
    nombres: string,
    apellidos: string,
    fecha_nacimiento: Date,
    correo: string,
    telefono: string,
    tipo_usuario: number,
    contrasena: string,
    direccion: Direccion
  ) {
    const usuario = {
      nombres,
      apellidos,
      fecha_nacimiento,
      correo,
      telefono,
      tipo_usuario,
      contrasena,
      direccion
    };
    return this.http.post(this.baseUrl + '/usuarios/registro_usuario', usuario).pipe();
  }

  //ruta para el login
  //creado por david el 20/04
  login(correo: string, contrasena: string) {
    let usuario: UsuarioLogin = {
      correo,
      contrasena
    };
    usuario.correo = correo;
    usuario.contrasena = contrasena;
    return this.http.post(this.baseUrl + "/usuarios/login", usuario).pipe();
  }

}