import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-editar-datos-usuario',
  templateUrl: './editar-datos-usuario.page.html',
  styleUrls: ['./editar-datos-usuario.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditarDatosUsuarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
