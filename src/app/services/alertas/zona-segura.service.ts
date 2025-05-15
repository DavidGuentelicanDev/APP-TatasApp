// Servicio para verificar zona segura y enviar alerta push si se sale de ella
// Creado por Ale - actualizado 11/05/2025 con validación por tipo_usuario

import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { DbOffService } from '../db-off.service';
import { ApiUsuariosService } from '../api/api-usuarios.service';
import { HttpClient } from '@angular/common/http';
import { environmentLocal } from '../../config.local';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class ZonaSeguraService {
  private id_usuario: number = 0;
  private direccionUsuario: string = '';
  private baseUrl = environmentLocal.URLbase;

  constructor(
    private dbOff: DbOffService,
    private apiUsuario: ApiUsuariosService,
    private http: HttpClient
  ) { }

  iniciarVerificacion() {
    console.log("TATAS: iniciarVerificacion() ejecutado");

    // Ejecutar inmediatamente para pruebas
    setTimeout(() => this.verificarZonaSegura(), 2000);

    // Ejecutar cada 5 minutos
    setInterval(() => this.verificarZonaSegura(), 5 * 60 * 1000);
  }

  async verificarZonaSegura() {
    console.log("TATAS: Comienza verificación");

    try {
      const usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
      console.log("TATAS: Usuario obtenido:", usuario);

      if (!usuario) {
        console.error("TATAS: No se encontraron datos del usuario.");
        return;
      }

      // Validación por tipo de usuario
      if (usuario.tipo_usuario !== 1) {
        console.warn("TATAS: Usuario no es adulto mayor. Tipo:", usuario.tipo_usuario);
        return;
      }

      this.id_usuario = usuario.id_usuario;
      console.log("TATAS: ID usuario:", this.id_usuario);

      const datosUsuario: any = await this.http
        .get(`${this.baseUrl}/usuarios/${this.id_usuario}`)
        .toPromise();
      console.log("TATAS: Respuesta de API:", JSON.stringify(datosUsuario));

      this.direccionUsuario = datosUsuario?.direccion_rel?.direccion_texto;
      if (!this.direccionUsuario) throw new Error("TATAS: Dirección no encontrada");

      const zonaSegura = await this.obtenerCoordenadasDesdeDireccion(this.direccionUsuario);
      console.log("TATAS: Coordenadas zona segura:", zonaSegura);

      const currentPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const actual = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      };
      console.log("TATAS: Posición actual:", actual);

      this.compararDistancia(actual, zonaSegura);

    } catch (e) {
      console.error("TATAS: Error en verificarZonaSegura:", e);
    }
  }

  async obtenerCoordenadasDesdeDireccion(direccion: string): Promise<{ lat: number, lng: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${environmentLocal.googleMapsApiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'OK') {
      return data.results[0].geometry.location;
    } else {
      throw new Error('TATAS: Error al geocodificar la dirección: ' + data.status);
    }
  }

  async compararDistancia(actual: { lat: number, lng: number }, zona: { lat: number, lng: number }) {
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(actual.lat, actual.lng),
      new google.maps.LatLng(zona.lat, zona.lng)
    );

    console.log("TATAS: Distancia calculada:", distancia);

    if (distancia > 100) {
      const mensaje = `Alerta: el adulto mayor salió de la zona segura a ${distancia.toFixed(0)} metros.`;
      const urlUbicacion = `https://www.google.com/maps?q=${actual.lat},${actual.lng}`;

      console.log("TATAS: Distancia supera 100m, enviando alerta...");
      await this.enviarAlerta(actual.lat, actual.lng, urlUbicacion);
      await this.hablar(mensaje);
    } else {
      console.log("TATAS: Usuario dentro de zona segura.");
    }
  }

  async enviarAlerta(lat: number, lng: number, url: string) {
    const alerta = {
      usuario_id: this.id_usuario,
      ubicacion: url,
      mensaje: 'El adulto mayor ha salido de la zona segura.',
      tipo_alerta: 1
    };

    try {
      const res = await this.http.post(`${this.baseUrl}/alertas/crear-alerta`, alerta).toPromise();
      console.log("TATAS: Alerta enviada correctamente:", res);
    } catch (err) {
      console.error('TATAS: Error al enviar alerta al backend:', err);
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
