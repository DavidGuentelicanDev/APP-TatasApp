import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { environmentLocal } from './config.local';
import { ZonaSeguraService } from './services/alertas/zona-segura.service';
import { NotificacionesAlertasService } from './services/alertas/notificaciones-alertas.service';
import { SplashScreen } from '@capacitor/splash-screen';

///////////////// agregado por andrea 21/05/2025
import { NotificacionEventosService } from './services/alertas/notificacion-eventos.service';


//funcion para poder cargar la api de google maps
export function loadGoogleMaps(apiKey: string) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
  script.defer = true;
  script.async = true;

  script.onerror = () => {
    console.error("tatas Error al cargar Google Maps");
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
    private zonaSegura: ZonaSeguraService,
    private notificacionesAlertas: NotificacionesAlertasService,
    ///////////////agregado por andrea 21/05/2025
    private notificacionEventosService: NotificacionEventosService
  ) {
    this.mostrarSplash(); //para que el splash aparezca al iniciar
  }

  ngOnInit() {
    try {
      console.log("TATAS: AppComponent iniciado");
      loadGoogleMaps(environmentLocal.googleMapsApiKey);
      this.zonaSegura.iniciarVerificacion();
      this.notificacionesAlertas.iniciarConsultaAutomaticaAlertas();
      ////////// agregado por Andrea 21/05/2025
      this.notificacionEventosService.iniciarConsultaEventosProximos();
    } catch (err) {
      console.error("TATAS: Error en ngOnInit AppComponent", err);
    }
  }

  //funcion para mostrar el splash screen
  //creada por david el 09/05
  async mostrarSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000
    });
  }

}