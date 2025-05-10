import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-editar-correo',
  templateUrl: './editar-correo.page.html',
  styleUrls: ['./editar-correo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EditarCorreoPage implements OnInit {

  idUsuarioLogueado: number = 0;
  correoUsuario: string = "";

  constructor(
    private apiConfig: ApiConfigService,
    private dbOff: DbOffService,
    private router: Router
  ) {}

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

  //funcion para obtener correo de usuario
  //creado por david el 09/05
  async obtenerDatosUsuario() {
    let datos = this.apiConfig.obtenerDatosUsuario(this.idUsuarioLogueado);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log("tatas", json.correo);

    this.correoUsuario = json.correo;
  }

}