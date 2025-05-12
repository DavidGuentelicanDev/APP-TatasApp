//creado por Ale 08-09-2025

import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion/ngx';
import { HttpClient } from '@angular/common/http';
import { environmentLocal } from '../config.local';
import { DbOffService } from './db-off.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class DeteccionCaidasService {

  private id_usuario: number = 0;
  private baseUrl = environmentLocal.URLbase;

  constructor(
    private deviceMotion: DeviceMotion,
    private http: HttpClient,
    private dbOff: DbOffService
  ) {}

  iniciarMonitoreo() {
    console.log("TATAS: Iniciando monitoreo de caídas...");

    // Intervalo de lectura cada 1 segundo
    setInterval(() => this.verificarCaida(), 1000);
  }

  async verificarCaida() {
    try {
      const usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
      if (!usuario) {
        console.error("TATAS: Usuario no encontrado en DB local.");
        return;
      }

      this.id_usuario = usuario.id_usuario;

      const data: DeviceMotionAccelerationData = await this.deviceMotion.getCurrentAcceleration();
      const fuerza = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
      //console.log("TATAS: Aceleración detectada:", fuerza);

      // Umbral aproximado de caída libre o impacto fuerte
      if (fuerza < 3 || fuerza > 30) {
        console.warn("TATAS: Posible caída detectada, enviando alerta...");
        await this.enviarAlerta('Se ha detectado una posible caída.');
        await this.hablar('Se ha detectado una posible caída.');
      }

    } catch (err) {
      console.error("TATAS: Error al obtener datos del giroscopio:", err);
    }
  }

  async enviarAlerta(mensaje: string) {
    try {
      const position = await Geolocation.getCurrentPosition();
      const url = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
  
      const alerta = {
        usuario_id: this.id_usuario,
        ubicacion: url,
        mensaje: mensaje,
        tipo_alerta: 3
      };
  
      console.log("ALE: Enviando alerta con ubicación:", JSON.stringify(alerta));
  
      const res = await this.http.post(`${this.baseUrl}/alertas/crear-alerta`, alerta).toPromise();
      console.log("ALE: Alerta por caída enviada correctamente:", res);
  
    } catch (err: any) {
      try {
        const detalle = typeof err.error === 'object' ? JSON.stringify(err.error) : err.error;
        console.error('ALE: Error al enviar alerta por caída (detalle JSON):', detalle);
      } catch (e) {
        console.error('ALE: Error inesperado al procesar error:', e);
      }
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
