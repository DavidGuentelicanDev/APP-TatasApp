import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation'; // Para obtener ubicación actual
import { AlertController, IonicModule } from '@ionic/angular'; // Para mostrar alertas tipo modal
import { LocalNotifications } from '@capacitor/local-notifications'; // Notificaciones en el mismo dispositivo
import { TextToSpeech } from '@capacitor-community/text-to-speech'; // Para lectura por voz
import { CommonModule } from '@angular/common';
import { environmentLocal } from 'src/app/config.local'; //importar api key oculta

declare var google: any; //para usar google maps con la apikey oculta

@Component({
  selector: 'app-mapa-prueba',
  standalone: true, // Componente standalone
  imports: [CommonModule, IonicModule],
  templateUrl: './mapa-prueba.page.html',
  styleUrls: ['./mapa-prueba.page.scss'],
})
export class MapaPruebaPage implements AfterViewInit {

  @ViewChild('map', { static: false }) mapElement!: ElementRef; // Referencia al div del mapa
  map: any; // Instancia del mapa de Google
  direccion: string = "Amunátegui 20, Santiago, Chile"; // Dirección zona segura de prueba

  constructor(private alertController: AlertController) {}

  async ngAfterViewInit() {
    try {
      // Solicita permisos para notificaciones locales
      await LocalNotifications.requestPermissions();

      // Convierte la dirección fija a coordenadas (lat/lng)
      const zonaSegura = await this.obtenerCoordenadasDesdeDireccion(this.direccion);

      // Obtiene la ubicación actual del usuario
      const currentPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000, // 10 segundos
        maximumAge: 0
      });
      const currentLatLng = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude,
      };

      // Inicializa el mapa con los marcadores y círculos
      this.inicializarMapa(currentLatLng, zonaSegura);

      // Compara la distancia entre el usuario y la zona segura
      this.compararDistancia(currentLatLng, zonaSegura);

    } catch (error) {
      console.error('Error general:', error);
      this.mostrarAlerta('Error', 'No se pudo cargar el mapa o la ubicación.');
    }
  }

  // Función que convierte una dirección en texto a coordenadas (lat, lng)
  async obtenerCoordenadasDesdeDireccion(direccion: string): Promise<{ lat: number, lng: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${environmentLocal.googleMapsApiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'OK') {
      return data.results[0].geometry.location;
    } else {
      throw new Error('Error al geocodificar la dirección: ' + data.status);
    }
  }

  // Carga y dibuja el mapa con dos marcadores y un círculo de 100m de radio
  inicializarMapa(actual: { lat: number, lng: number }, zona: { lat: number, lng: number }) {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: actual,
      zoom: 18
    });

    // Marcador azul en la ubicación actual
    new google.maps.Marker({
      position: actual,
      map: this.map,
      title: 'Tu ubicación',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    // Círculo verde representando la zona segura
    new google.maps.Circle({
      strokeColor: '#00FF00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.35,
      map: this.map,
      center: zona,
      radius: 100 // en metros
    });

    // Marcador verde en la zona segura
    new google.maps.Marker({
      position: zona,
      map: this.map,
      title: 'Zona Segura',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
  }

  // Calcula la distancia entre el usuario y la zona segura
  async compararDistancia(actual: { lat: number, lng: number }, zona: { lat: number, lng: number }) {
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(actual.lat, actual.lng),
      new google.maps.LatLng(zona.lat, zona.lng)
    );

    // Si está fuera de la zona segura (> 10m), se lanza alerta, voz y notificación
    if (distancia > 100) {
      const mensaje = `¡Alerta! Estás fuera de la zona segura. Distancia: ${distancia.toFixed(0)} metros.`;
      await this.lanzarNotificacionLocal(distancia);
      await this.hablar(mensaje);
      this.mostrarAlerta('Fuera de la zona segura', mensaje);
    } else {
      console.log('Dentro de la zona segura');
    }
  }

  // Muestra una notificación local con el mensaje de alerta
  async lanzarNotificacionLocal(distancia: number) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Alerta de ubicación',
          body: `¡Estás fuera de la zona segura! Distancia: ${distancia.toFixed(1)} mts`,
          id: 1,
          sound: 'beep.caf',
          smallIcon: 'res://icon',
          iconColor: '#ff0000'
        }
      ]
    });
  }

  // Muestra una alerta visual (modal) en pantalla
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Usa texto a voz para anunciar el mensaje de alerta
  async hablar(mensaje: string) {
    await TextToSpeech.speak({
      text: mensaje,
      lang: 'es-ES',
      rate: 1.0
    });
  }

}
