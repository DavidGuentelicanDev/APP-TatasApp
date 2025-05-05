import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventosPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  //navegar a la pagina para crear eventos
  //creado por david el 01/05
  navegarCrearEvento() {
    this.router.navigate(["crear-evento"]);
  }

}
