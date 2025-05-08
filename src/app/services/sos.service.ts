import { Injectable } from '@angular/core';
import { DbOffService } from './db-off.service';
import { Geolocation } from '@capacitor/geolocation';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { ApiAlertasService } from './api-alertas.service';

@Injectable({
  providedIn: 'root'
})
export class SosService {

  private id_usuario: number = 0;

  constructor(
    private dbOff: DbOffService,
    private apiAlertas: ApiAlertasService
  ) { }

  //SERVICIO PARA REGISTRAR ALERTA DEL BOTON SOS
  //CREADO POR ALE 04-05-2025
  async enviarAlertaSOSDesdeBoton() {
    try {
      const usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
      if (!usuario) {
        console.error("No se encontraron datos del usuario.");
        return;
      }

      this.id_usuario = usuario.id_usuario;

      const position = await Geolocation.getCurrentPosition();
      const ubicacion = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;

      const alerta = {
        usuario_id: this.id_usuario,
        ubicacion: ubicacion,
        mensaje: 'Botón SOS presionado',
        tipo_alerta: 4 
      };

      await this.apiAlertas.crearAlerta(alerta);
      await this.hablar('Alerta SOS activada');

    } catch (err) {
      console.error("TATAS: Error al enviar alerta SOS desde botón:", err);
    }
  }

  async hablar(mensaje: string) {
    await TextToSpeech.speak({
      text: mensaje,
      lang: 'es-ES',
      rate: 1.0
    });
  }

}