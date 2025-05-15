import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter
} from '@ionic/angular/standalone';

import { DbOffService } from 'src/app/services/db-off.service';
import { SosService } from 'src/app/services/alertas/sos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-tata',
  templateUrl: './home-tata.page.html',
  styleUrls: ['./home-tata.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonFooter,
    CommonModule,
    FormsModule
  ]
})
export class HomeTataPage implements OnInit {

  constructor(
    private dbOff: DbOffService,
    private router: Router,
    private sos: SosService
  ) {}

  ngOnInit() {}

  // Navegar a la página de eventos
  navegarEventos() {
    this.router.navigate(["eventos"]);
  }

  // Navegar a la página de familiares
  navegarFamiliares() {
    this.router.navigate(["familiares"]);
  }

  // Enviar alerta SOS
  async generarSOS() {
    await this.sos.enviarAlertaSOSDesdeBoton();
  }

// Navegar a configuración
  async navegarConfig() {
    this.router.navigate(["configuracion"])}
}
