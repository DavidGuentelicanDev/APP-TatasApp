import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { SosService } from 'src/app/services/sos.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonItem, IonList, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PrincipalPage implements OnInit {

  constructor(
    private dbOff: DbOffService,
    private router: Router,
    private sos: SosService
  ) { }

  ngOnInit() {
  }

  //navegar a la pagina de eventos
  //creado por andrea el 30/04
  navegarEventos() {
    this.router.navigate(["eventos"]);
  }

  //navegar a pagina familiares
  //creado por david el 02/05
  navegarFamiliares() {
    this.router.navigate(["familiares"]);
  }

  //creado por andrea
  navegarEventosFamiliar() {
    this.router.navigate(["evento-familiar"]);
  }

  //navegar zona segura (temporal)
  navegarZonaSegura() {
    this.router.navigate(["registro-alarmas"]);
  }

  navegarMapaPrueba() {
    this.router.navigate(["mapa-prueba"]);
  }

  //navegar a la pagina de configuracion
  navegarConfig() {
    this.router.navigate(["configuracion"]);
  }

  async generarSOS() {
    await this.sos.enviarAlertaSOSDesdeBoton();
  }

}