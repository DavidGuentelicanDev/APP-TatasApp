import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton} from '@ionic/angular/standalone';
import {NavigationExtras, Router } from '@angular/router';
import { Evento } from 'src/app/interfaces/evento';
import { ApiEventoService } from 'src/app/services/api/api-evento.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AlertController } from '@ionic/angular/standalone';
import { provideIonicAngular } from '@ionic/angular/standalone';
import esLocale from '@fullcalendar/core/locales/es';
import { DbOffService } from 'src/app/services/db-off.service';



@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FullCalendarModule  ]

})  
export class EventosPage implements OnInit {
  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this), // 👈 ACTIVADOR
    eventContent: this.soloHoraEvento.bind(this),
    eventDisplay: 'block',
    locale: esLocale
  };

  idUsuarioRegistrado: number = 0; //usuario registrado

  //modelo de evento
  mdl_evento: Evento = {
    usuarioId: 0,
    nombre: "",
    descripcion: "",
    fechaHora: "", // tipo ISO: "2025-05-21T10:30:00"
    tipoEvento: 0
  }

  eventos: Evento[] = [];
  constructor(
    private router: Router,
    private apiEventoService: ApiEventoService,
    private alertController: AlertController,
    private dbOff: DbOffService,
  ) { }

  ngOnInit() {}

  //obtener id de usuario registrado al momento de entrar a la pagina
  //creado por andrea el 30/04
  async obtenerIdUsuarioLogueado() {
    let usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    if (usuario) {
      this.idUsuarioRegistrado = usuario.id_usuario; //asignar id de usuario registrado
      console.log("tatas: ID USUARIO REGISTRADO: ", this.idUsuarioRegistrado);
    } else {
      console.log("tatas: NO HAY USUARIO REGISTRADO");
      let extras: NavigationExtras = {replaceUrl: true};
      this.router.navigate(["login"], extras);
    }
  }


  soloHoraEvento(arg: any) {
    const fecha = new Date(arg.event.start);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const horaTexto = `${horas}:${minutos}`;
  
    return { html: `<div style="font-size: 13px; text-align: center;">${horaTexto}</div>` };
  }

  async ionViewWillEnter() {
    const usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    const usuarioId = usuario?.id_usuario;
  
    if (!usuarioId) {
      console.log("tatas: no hay usuario logueado");
      this.router.navigate(["login"], { replaceUrl: true });
      return;
    }
  
    this.apiEventoService.obtenerEventos(usuarioId).subscribe((eventos: any[]) => {
      console.log('tatasa Eventos cargados desde API:', JSON.stringify(eventos, null, 2));
  
      const eventosConvertidos = eventos.map(evento => {
        const clase =
          evento.tipo_evento === 1 ? 'event-medico' :
          evento.tipo_evento === 2 ? 'event-familiar' :
          evento.tipo_evento === 3 ? 'event-personal' :
          'event-otro';
      
        return {
          id: evento.id,
          title: evento.nombre,
          start: new Date(evento.fecha_hora).toISOString(),
          description: evento.descripcion,
          extendedProps: {
            tipoEvento: evento.tipo_evento,
            usuarioId: evento.usuario_id,
            id: evento.id
          },
          classNames: [clase]
        };
      });
  
      this.calendarOptions = {
        ...this.calendarOptions,
        events: eventosConvertidos
      };
    });
  }
  async handleEventClick(clickInfo: any) {
    const evento = clickInfo.event;
    const id = evento.id || evento.extendedProps?.id;
  
    const titulo = evento.title;
    const descripcion = evento.extendedProps?.description || 'Sin descripción';
    const tipoEvento = evento.extendedProps?.tipoEvento;
    const emoji = this.obtenerEmoji(tipoEvento);
    const tipoTexto = this.obtenerNombreTipo(tipoEvento);
    const fecha = new Date(evento.start);
  
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const fechaHora = `${anio}-${mes}-${dia}T${horas}:${minutos}`; // formato para input datetime-local
  
    const alert = await this.alertController.create({
      header: `${emoji} ${titulo}`,
      subHeader: `📅 ${dia}/${mes}/${anio} a las ${horas}:${minutos} — ${tipoTexto}`,
      message: descripcion,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminacion(id);
          }
        },
        {
          text: 'Editar evento',
          handler: () => {
            console.log("tatas: Navegando a la edición del evento con id:", id);
            this.router.navigate(['/modificar-evento', id], {
              state: {
                evento: {
                  id,
                  usuarioId: evento.extendedProps?.usuarioId ?? 0,
                  nombre: titulo,
                  descripcion: descripcion,
                  fechaHora: evento.start.toISOString(),
                  tipoEvento: tipoEvento
                }
              }
            });

          }
        }
      ]
    });
  
    await alert.present();
  }
  
  obtenerNombreTipo(tipo: number): string {
    switch (tipo) {
      case 1: return 'Cita Médica';
      case 2: return 'Evento Familiar';
      case 3: return 'Evento Personal';
      case 4: return 'Otro';
      default: return 'Desconocido';
    }
  }

  obtenerEmoji(tipo: number): string {
    switch (tipo) {
      case 1: return '🩺';
      case 2: return '👨‍👩‍👧';
      case 3: return '📌';
      case 4: return '❓';
      default: return '🔘';
    }
  }
  //navegar a la pagina para crear eventos
  //creado por david el 01/05
  navegarCrearEvento() {
    this.router.navigate(["crear-evento"]);
  }
  

  async confirmarEliminacion(id: number) {
    const confirm = await this.alertController.create({
      header: '¿Eliminar evento?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.apiEventoService.eliminarEvento(id).subscribe(() => {
              this.ionViewWillEnter(); // recargar calendario
            });
          }
        }
      ]
    });
  
    await confirm.present();
  }
  

}
