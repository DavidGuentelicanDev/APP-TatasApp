import { Injectable } from '@angular/core';
import { ApiAlertasService } from '../api/api-alertas.service';
import { DbOffService } from '../db-off.service';
import { ActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { Browser } from '@capacitor/browser';


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
    this.solicitarPermisosNotificaciones(); //para pedir permisos de notificaciones
    this.escucharClicEnNotificaciones(); //para iniciar el poder hacer "click" en la notificacion local y navegar a google maps
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

    this.apiAlertas.obtenerAlertasPendientes(this.idUsuarioLogueado).subscribe({
      next: (alertas) => {
        console.log("tatas: alertas recibidas", JSON.stringify(alertas));

        //se generan las notificaciones locales
        if (alertas && alertas.length > 0) {
          this.mostrarNotificacion(alertas);
        }
      },
      error: (error) => {
        console.error("tatas: error al recibir alertas", JSON.stringify(error));
      }
    });
  }

  //inicia la consulta automatica cada N segundos
  //creado por david el 07/05
  async iniciarConsultaAutomaticaAlertas() {
    //evita enviar multiples intervalos si ya hay uno vigente
    if (this.intervaloAlertas) {
      clearInterval(this.intervaloAlertas);
    }

    this.recibirAlertasPendientes(); //se ejecuta por primera vez la primera solicitud

    //luego se ejecuta cada N segundos
    this.intervaloAlertas = setInterval(() => {
      this.recibirAlertasPendientes();
    }, 120000); //(MODIFICAR ESTA PARTE PARA GENERAR EL TIEMPO REAL DE INTERVALO)

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
        schedule: { at: new Date(Date.now() + 1000) },
        sound: "",
        attachments: undefined,
        actionTypeId: "",
        extra: {
          ubicacion: alerta.ubicacion
        }
      };
    });
    await LocalNotifications.schedule({ notifications: notificaciones }); //mostrar la notificacion local

    //luego de mostrar la notificacion se envia la actualizacion de estado de alerta para que no se repita
    for (let alerta of alertas) {
      try {
        let respuesta = await this.apiAlertas.actualizarEstadoAlerta(alerta.id);
        console.log(`tatas: estado de alerta ${alerta.id} actualizado:`, respuesta);
      } catch (e) {
        console.error(`tatas: error al actualizar estado de alerta ${alerta.id}`, e);
      }
    }
  }

  //metodo para que al hacer click en la notificacion local, se navegue a google maps con la direccion indicada
  //creado por david el 08/05
  escucharClicEnNotificaciones() {
    LocalNotifications.addListener('localNotificationActionPerformed', async (notification: ActionPerformed) => {
      let url = notification.notification.extra?.ubicacion;

      if (url) {
        try {
          await Browser.open({ url });
        } catch (e) {
          console.error("TATAS: No se pudo abrir el navegador", e);
        }
      } else {
        console.log("TATAS: No hay URL en la notificación");
      }
    });
  }

}