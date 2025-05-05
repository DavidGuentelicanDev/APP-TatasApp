import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { environmentLocal } from './config.local';
import { ZonaSeguraService } from './services/zona-segura.service';

//funcion para poder cargar la api de google maps
export function loadGoogleMaps(apiKey: string) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
  script.defer = true;
  script.async = true;

  script.onerror = () => {
    console.error("Error al cargar Google Maps");
  };

  document.head.appendChild(script);
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(
    private zonaSegura: ZonaSeguraService
  ) {}

  ngOnInit() {
    try {
      console.log("TATAS: AppComponent iniciado");
      loadGoogleMaps(environmentLocal.googleMapsApiKey);
      this.zonaSegura.iniciarVerificacion();
    } catch (err) {
      console.error("TATAS: Error en ngOnInit AppComponent", err);
    }
  }
  

}
