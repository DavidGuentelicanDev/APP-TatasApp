import { Injectable } from '@angular/core';
import { ApiAlertasService } from './api-alertas.service';
import { DbOffService } from './db-off.service';
import { LocalNotifications } from '@capacitor/local-notifications';


@Injectable({
  providedIn: 'root'
})
export class NotificacionesAlertasService {

  idUsuarioLogueado: number = 0;
  tipoUsuarioLogueado: number = 0;
  private intervaloAlertas: any = null //para definir el intervalo en el cual se estarán solicitando las alertas tipo 0 a la api

  //diccionario de tipos de alerta
  private readonly TIPOS_ALERTA: { [key: number]: string } = {
    1: "Zona Segura",
    2: "Inactividad",
    3: "Caída",
    4: "SOS"
  };

  constructor(
    private apiAlertas: ApiAlertasService,
    private dbOff: DbOffService
  ) {
    this.solicitarPermisosNotificaciones();
  }

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

        //se generan las notificaciones locales
        if (alertas && alertas.length > 0) {
          this.mostrarNotificacion(alertas);
        }
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
    }, 15000);

    console.log("tatas: Consulta automática de alertas iniciada");
  }

  //metodo para solicitar permiso de notificaciones locales
  //creado por david el 07/05
  async solicitarPermisosNotificaciones() {
    const status = await LocalNotifications.requestPermissions();
    if (status.display !== 'granted') {
      console.warn("TATAS: Permiso para notificaciones locales NO concedido");
    } else {
      console.log("TATAS: Permiso para notificaciones locales concedido");
    }
  }

  //metodo para mostrar el formato de alerta
  //creado por david el 08/05
  async mostrarNotificacion(alertas: any[]) {
    let notificaciones = alertas.map((alerta) => {
      let tipo = this.TIPOS_ALERTA[alerta.tipo_alerta] || "Alerta recibida";
      return {
        title: tipo,
        body: `${alerta.mensaje}. Ubicación: ${alerta.ubicacion}`,
        id: alerta.id,
        schedule: { at: new Date(Date.now() + 500) },
        sound: "",
        attachments: undefined,
        actionTypeId: "",
        extra: null
      };
    });
    await LocalNotifications.schedule({ notifications: notificaciones });
  }

}