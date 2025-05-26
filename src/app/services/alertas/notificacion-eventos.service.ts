import { Injectable } from '@angular/core';
import { ApiEventoService } from '../api/api-evento.service';
import { DbOffService } from '../db-off.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Evento } from 'src/app/interfaces/evento';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root'
})
export class NotificacionEventosService {

  private idUsuarioLogueado: number = 0;
  private intervaloEventos: any = null;
  private ultimoEventoNotificado: number | null = null;

  constructor(
    private apiEvento: ApiEventoService,
    private dbOff: DbOffService
  ) {}

  async obtenerUsuarioLogueado() {
    const usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    if (usuario) {
      this.idUsuarioLogueado = usuario.id_usuario;
      console.log("tatas: ID USUARIO REGISTRADO:", this.idUsuarioLogueado);
    } else {
      console.log("tatas: NO HAY USUARIO REGISTRADO");
    }
  }

  async iniciarConsultaEventosProximos() {
    await this.obtenerUsuarioLogueado();

    if (!this.idUsuarioLogueado) {
      console.log("tatas: No se puede iniciar consulta de eventos, usuario no logueado");
      return;
    }

    if (this.intervaloEventos) {
      clearInterval(this.intervaloEventos);
    }

    // Primera consulta inmediata
    this.consultarEventosProximos();

    // Consultas periódicas cada minuto
    this.intervaloEventos = setInterval(() => {
      this.consultarEventosProximos();
    }, 60000);
  }

  async consultarEventosProximos() {
  this.apiEvento.obtenerEventosProximos(this.idUsuarioLogueado, 15).subscribe({
    next: async (eventos: Evento[]) => {
      if (eventos.length > 0) {
        const eventosNuevos = eventos.filter(e =>
          e.id !== undefined && e.id !== this.ultimoEventoNotificado
        );

        if (eventosNuevos.length === 0) return;

        const notificaciones = eventosNuevos.map(evento => {
          const hora = new Date(evento.fechaHora ).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
          });

          const mensaje = `${evento.nombre} a las ${hora}`;

          if (evento.id !== undefined) {
            this.ultimoEventoNotificado = evento.id;
          }

          // 🧠 Notificación visual + hablada
          this.hablar(mensaje); // 👈 Aquí se reproduce la voz

          return {
            title: '⏰ Evento Próximo',
            body: mensaje,
            id: evento.id ?? Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: '',
            extra: {
              descripcion: evento.descripcion
            }
          };
        });

        await LocalNotifications.schedule({ notifications: notificaciones });
        console.log("tatas: Notificaciones exactas enviadas:", notificaciones.length);
      }
    },
    error: (err) => {
      console.error("tatas: Error al consultar eventos próximos", err);
    }
  });
}

async hablar(mensaje: string) {
  await TextToSpeech.speak({
    text: mensaje,
    lang: 'es-ES',
    rate: 1.0
  });
}
}
