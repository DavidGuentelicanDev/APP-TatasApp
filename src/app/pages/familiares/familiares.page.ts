import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-familiares',
  templateUrl: './familiares.page.html',
  styleUrls: ['./familiares.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FamiliaresPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  //navega a la pagina de registrar familiar
  //creado por david el 02/05
  navegarAgregarFamiliar() {
    this.router.navigate(["agregar-familiar"]);
  }

}
