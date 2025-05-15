import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonButton,
  AlertController,
  IonicModule
} from '@ionic/angular';

import { Evento } from 'src/app/interfaces/evento';
import { ApiEventoService } from 'src/app/services/api/api-evento.service';
import { DbOffService } from 'src/app/services/db-off.service';

@Component({
  selector: 'app-modificar-evento',
  templateUrl: './modificar-evento.page.html',
  styleUrls: ['./modificar-evento.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule  ],
})
export class ModificarEventoPage implements OnInit {



    idEvento!: number;
    mdl_evento: Evento = {
    usuarioId: 0,
    nombre: '',
    descripcion: '',
    fechaHora: '',
    tipoEvento: 1,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiEventoService: ApiEventoService,
    private dbOff: DbOffService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.idEvento = Number(this.route.snapshot.paramMap.get('id'));
  
    const nav = history.state.evento;
    if (nav) {
      this.mdl_evento = {
        id: nav.id,
        usuarioId: nav.usuarioId,
        nombre: nav.nombre,
        descripcion: nav.descripcion,
        fechaHora: nav.fechaHora,
        tipoEvento: nav.tipoEvento
      };
    // } else {
    //   // Si no vienen datos, puedes cargar desde la API usando el id
    //   this.cargarDesdeApi();
    // }
    }
  }

  modificarEvento() {
    if (!this.mdl_evento.nombre || !this.mdl_evento.fechaHora || !this.mdl_evento.tipoEvento) {
      this.alertController.create({
        header: 'Error',
        message: 'Completa todos los campos requeridos.',
        buttons: ['OK']
      }).then(a => a.present());
      return;
    }

    this.apiEventoService.modificarEvento(this.idEvento, this.mdl_evento).subscribe(() => {
      this.router.navigate(['/eventos']);
    }, () => {
      this.alertController.create({
        header: 'Error',
        message: 'No se pudo guardar el evento.',
        buttons: ['OK']
      }).then(a => a.present());
    });
  }
}

