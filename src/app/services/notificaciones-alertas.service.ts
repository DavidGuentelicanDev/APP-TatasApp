import { Injectable } from '@angular/core';
import { ApiAlertasService } from './api-alertas.service';
import { DbOffService } from './db-off.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesAlertasService {

  idUsuarioLogueado: number = 0;
  tipoUsuarioLogueado: number = 0;
  private intervaloAlertas: any = null //para definir el intervalo en el cual se estarán solicitando las alertas tipo 0 a la api

  constructor(
    private apiAlertas: ApiAlertasService,
    private dbOff: DbOffService
  ) { }

  //obtener id de usuario logueado
  //creado por andrea el 30/04
  async obtenerUsuarioLogueado() {
    let usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    if (usuario) {
      this.idUsuarioLogueado = usuario.id_usuario; //asignar id de usuario registrado
      console.log("tatas: ID USUARIO REGISTRADO: ", this.idUsuarioLogueado);
      this.tipoUsuarioLogueado = usuario.tipo_usuario; //asignar tipo de usuario logueado
      console.log("tatas: TIPO USUARIO REGISTRADO: ", this.tipoUsuarioLogueado);
    } else {
      console.log("tatas: NO HAY USUARIO REGISTRADO");
    }
  }

  //metodo para recibir las alertas pendientes (estado 0) (SOLO FAMILIAR)
  //creado por david el 07/05
  async recibirAlertasPendientes() {
    this.apiAlertas.obtenerAlertasPendientes(this.idUsuarioLogueado).subscribe({
      next: (alertas) => {
        console.log("tatas: alertas recibidas", JSON.stringify(alertas));
      },
      error: (error) => {
        console.error("tatas: error al recibir alertas", error);
      }
    });
  }

  //inicia la consulta automatica cada N segundos
  //creado por david el 07/05
  async iniciarConsultaAutomaticaAlertas() {
    await this.obtenerUsuarioLogueado();

    //validaciones por id y tipo de usuario logueado
    if (!this.idUsuarioLogueado) {
      console.log("tatas: No se puede iniciar consulta automática, usuario no logueado");
      return;
    }

    if (this.tipoUsuarioLogueado != 2) {
      console.log("tatas: No se puede iniciar consulta automática, usuario no es tipo familiar");
      return;
    }

    //evita enviar multiples intervalos si ya hay uno vigente
    if (this.intervaloAlertas) {
      clearInterval(this.intervaloAlertas);
    }

    this.recibirAlertasPendientes(); //se ejecuta por primera vez la primera solicitud

    //luego se ejecuta cada N segundos
    this.intervaloAlertas = setInterval(() => {
      this.recibirAlertasPendientes();
    }, 10000);

    console.log("tatas: Consulta automática de alertas iniciada");
  }

}