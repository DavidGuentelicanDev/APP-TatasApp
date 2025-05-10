import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonButton, IonInput, IonDatetime } from '@ionic/angular/standalone';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DatosUsuarioEditar } from 'src/app/interfaces/usuario';


@Component({
  selector: 'app-editar-datos-usuario',
  templateUrl: './editar-datos-usuario.page.html',
  styleUrls: ['./editar-datos-usuario.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonDatetime]
})
export class EditarDatosUsuarioPage implements OnInit {

  idUsuarioLogueado: number = 0;

  //para editar los usuarios
  datosUsuario: DatosUsuarioEditar = {
    id: 0,
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: {
      direccion_texto: '',
      adicional: ''
    }
  };

  constructor(
    private apiConfig: ApiConfigService,
    private dbOff: DbOffService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.obtenerIdUsuarioLogueado();
    await this.obtenerDatosUsuario();
  }

  //obtener id de usuario registrado al momento de entrar a la pagina
  //creado por andrea el 30/04
  async obtenerIdUsuarioLogueado() {
    let usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    if (usuario) {
      this.idUsuarioLogueado = usuario.id_usuario; //asignar id de usuario registrado
      console.log("tatas: ID USUARIO REGISTRADO: ", this.idUsuarioLogueado);
    } else {
      console.log("tatas: NO HAY USUARIO REGISTRADO");
      let extras: NavigationExtras = {replaceUrl: true};
      this.router.navigate(["login"], extras);
    }
  }

  //funcion para obtener los datos de usuario necesarios
  //creado por david el 09/05
  async obtenerDatosUsuario() {
    let datos = this.apiConfig.obtenerDatosUsuario(this.idUsuarioLogueado);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log("tatas", this.datosUsuario);

    this.datosUsuario.nombres = json.nombres;
    this.datosUsuario.apellidos = json.apellidos;
    this.datosUsuario.fecha_nacimiento = json.fecha_nacimiento;
    this.datosUsuario.telefono = json.telefono;
    this.datosUsuario.direccion.direccion_texto = json.direccion_rel.direccion_texto;
    this.datosUsuario.direccion.adicional = json.direccion_rel.adicional;
  }

  async guardarCambios() {
    try {
      //convertir la fecha a formato yyyy-mm-dd
      let fecha = new Date(this.datosUsuario.fecha_nacimiento);
      let fechaFormateada = fecha.toISOString().split('T')[0]; //formato "yyyy-mm-dd"

      let datosParaEnviar = {
        id: this.idUsuarioLogueado,
        nombres: this.datosUsuario.nombres,
        apellidos: this.datosUsuario.apellidos,
        fecha_nacimiento: fechaFormateada,
        telefono: this.datosUsuario.telefono,
        direccion: this.datosUsuario.direccion
      };

      let resultado = this.apiConfig.editarDatosUsuario(datosParaEnviar);
      let respuesta = await lastValueFrom(resultado);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log("tatas", json.status);
      console.log("tatas", json.message);
    } catch (e) {
      console.error("tatas: Error al actualizar datos", JSON.stringify(e));
    }
  }

}