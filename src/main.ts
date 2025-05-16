import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideHttpClient } from '@angular/common/http'; //importacion para apis
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; //importacion de sqlite
import { addIcons } from 'ionicons'; //para usar los ionic icons
//se debe importar cada icono por separado
import {
  locate,
  calendar,
  people,
  personOutline,
  lockClosedOutline,
  arrowForwardOutline,
  radioButtonOn,
  radioButtonOff,
  trash,
  pencil,
  notificationsCircleOutline,
  personAdd,
  settings,
  fileTrayFull
} from 'ionicons/icons';

//registrar iconos antes de iniciar la app
addIcons({
  locate,
  calendar,
  people,
  personOutline,
  lockClosedOutline,
  arrowForwardOutline,
  radioButtonOn,
  radioButtonOff,
  trash,
  pencil,
  notificationsCircleOutline,
  personAdd,
  settings,
  fileTrayFull
});

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), //inyectar para poder usar la api
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    SQLite,
  ],
});
