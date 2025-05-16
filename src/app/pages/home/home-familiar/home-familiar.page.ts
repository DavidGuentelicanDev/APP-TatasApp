import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';

import { DbOffService } from 'src/app/services/db-off.service';
import { SosService } from 'src/app/services/alertas/sos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-familiar',
  templateUrl: './home-familiar.page.html',
  styleUrls: ['./home-familiar.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
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
