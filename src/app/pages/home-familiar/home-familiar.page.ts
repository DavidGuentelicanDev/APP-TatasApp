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
import { SosService } from 'src/app/services/sos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-familiar',
  templateUrl: './home-familiar.page.html',
  styleUrls: ['./home-familiar.page.scss'],
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
export class HomeFamiliarPage implements OnInit {

  constructor(
    private dbOff: DbOffService,
    private router: Router,
    private sos: SosService
  ) {}

  ngOnInit() {}

  // Navegar a la página de eventos-familiar
  navegarEventos() {
    this.router.navigate(["evento-familiar"]);
  }

  
  navegarHistorial() {
    this.router.navigate(["registro-alarmas"]);
  }

  // Navegar a configuración
  async navegarConfig() { 
    this.router.navigate(["configuracion"])
  }


}
