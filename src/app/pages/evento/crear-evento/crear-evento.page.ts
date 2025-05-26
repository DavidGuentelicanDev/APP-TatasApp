import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonSelectOption, IonInput, IonDatetime, IonSelect } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { DbOffService } from 'src/app/services/db-off.service';
import { ApiEventoService } from 'src/app/services/api/api-evento.service';
import { Evento } from 'src/app/interfaces/evento';
import { lastValueFrom } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
  standalone: true,
  imports: [IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonSelectOption, IonInput, IonDatetime, IonSelect]
})
export class CrearEventoPage implements OnInit {

  idUsuarioRegistrado: number = 0; //usuario registrado

  //modelo de evento
  mdl_evento: Evento = {
    usuarioId: 0,
    nombre: "",
    descripcion: "",
    fechaHora: "", // tipo ISO: "2025-05-21T10:30:00"
    tipoEvento: 0
  }

  constructor(
    private router: Router,
    private dbOff: DbOffService,
    private apiEvento: ApiEventoService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.obtenerIdUsuarioLogueado(); //obtener id de usuario logueado al abrir la pagina
  }

  //obtener id de usuario registrado al momento de entrar a la pagina
  //creado por andrea el 30/04
  async obtenerIdUsuarioLogueado() {
    let usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    if (usuario) {
      this.idUsuarioRegistrado = usuario.id_usuario; //asignar id de usuario registrado
      console.log("tatas: ID USUARIO REGISTRADO: ", this.idUsuarioRegistrado);
    } else {
      console.log("tatas: NO HAY USUARIO REGISTRADO");
      let extras: NavigationExtras = {replaceUrl: true};
      this.router.navigate(["login"], extras);
    }
  }

  //metodo para crear un evento
  //creado por Andrea el 30/04/2025
  async crearEvento() {
    this.mdl_evento.usuarioId = this.idUsuarioRegistrado; //asignar id de usuario registrado

    //validar campos vacios
    if (this.mdl_evento.nombre === "" || this.mdl_evento.descripcion === "" || this.mdl_evento.fechaHora === "" || this.mdl_evento.tipoEvento === 0) {
      await this.alertaCrearEvento("Error", "Por favor complete todos los campos.");
      return;
    }

    try {
      //enviar datos a la api
      const fechaLocal = new Date(this.mdl_evento.fechaHora);
       this.mdl_evento.fechaHora = fechaLocal.toISOString(); // ← AQUÍ está la clave

      let datos = this.apiEvento.crearEvento(this.mdl_evento);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log("tatas: status ", json.status);

      //validacion
      if (json.status === "success") {
        await this.alertaCrearEvento("Evento creado", json.message);
        setTimeout(() => {
          this.router.navigate(["eventos"]);
        }, 1000);
      } else {
        await this.alertaCrearEvento("Error", json.message);
        this.limpiarFormulario();
      }
    } catch (e) {
      console.log("tatas error:", JSON.stringify(e));
      await this.alertaCrearEvento("Error", "Error al crear el evento. Intente nuevamente.");
      this.limpiarFormulario();
    }
  }

  //alerta de creacion de evento
  //creado por Andrea el 30/04/2025
  async alertaCrearEvento(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  //metodo para limpiar el formulario
  //creado por Andrea el 30/04/2025
  limpiarFormulario() {
    this.mdl_evento = {
      usuarioId: this.idUsuarioRegistrado,
      nombre: '',
      descripcion: '',
      fechaHora: '',
      tipoEvento: 0
    };
  }

}
