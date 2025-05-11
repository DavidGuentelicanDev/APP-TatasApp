import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-editar-contrasena',
  templateUrl: './editar-contrasena.page.html',
  styleUrls: ['./editar-contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditarContrasenaPage implements OnInit {

  idUsuarioLogueado: number = 0;
  correoUsuario: string = "";
  correoIngresado: string = "";
  correoValido: boolean | null = null;

  constructor(
    private apiConfig: ApiConfigService,
    private dbOff: DbOffService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
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

  //funcion para obtener correo de usuario
  //creado por david el 10/05
  async obtenerDatosUsuario() {
    let datos = this.apiConfig.obtenerDatosUsuario(this.idUsuarioLogueado);
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    this.correoUsuario = json.correo;
    console.log("tatas CORREO REGISTRADO:", this.correoUsuario);
  }

    //para validar el correo
  //creado por david el 10/05
  async validarCorreoIngresado() {
    let loading = await this.loadingController.create({
      message: 'Validando tu correo electrónico...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();
    setTimeout(async() => {
      await loading.dismiss();
      this.correoValido = this.correoIngresado.trim().toLowerCase() === this.correoUsuario.trim().toLowerCase();
    }, 500);
  }

}
