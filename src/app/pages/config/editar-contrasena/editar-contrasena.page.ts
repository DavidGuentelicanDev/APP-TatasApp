import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from 'src/app/services/api/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { ContrasenaEditar } from 'src/app/interfaces/usuario';


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
  nuevaContrasena: string = "";
  confirmarContrasena: string = "";

  datosContrasena: ContrasenaEditar = {
    id: 0,
    contrasena: ""
  };

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

  //metodo para editar contraseña
  //creado por david el 11/05
  async editarContrasena() {
    this.datosContrasena = {
      id: this.idUsuarioLogueado,
      contrasena: this.nuevaContrasena
    };

    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      console.log("tatas TODOS LOS CAMPOS SON OBLIGATORIOS");
      await this.alertValidaciones("Error", "Debes ingresar ambas contraseñas para poder guardar");
      return;
    }

    const formatoPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!formatoPassword.test(this.nuevaContrasena)) {
      console.log("tatas FORMATO DE CONTRASEÑA NO VÁLIDO");
      await this.alertValidaciones("Error", "Recuerda que tu contraseña debe tener mínimo 8 caractéres (una Mayúscula, una minúscula y un número");
      this.nuevaContrasena = "";
      this.confirmarContrasena = "";
      return;
    }

    if (this.nuevaContrasena != this.confirmarContrasena) {
      console.log("tatas LAS CONTRASEÑAS NO COINCIDEN");
      await this.alertValidaciones("Error", "Las contraseñas ingresadas no coinciden. Ingrésalas nuevamente");
      this.confirmarContrasena = "";
      return;
    }

    //falta validar que el correo no este registrado previamente

    let loading = await this.loadingController.create({
      message: 'Actualizando tu contraseña...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();

    try {
      let datos = this.apiConfig.editarContrasena(this.datosContrasena);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);

      await loading.dismiss();

      if (json.status === "success") {
        console.log("tatas", json.message);

        let alertaExito = await this.alertController.create({
          header: "Éxito",
          message: "Contraseña actualizada correctamente. Debes volver a ingresar tus credenciales",
          backdropDismiss: false
        });
        await alertaExito.present();

        setTimeout(async () => {
          await alertaExito.dismiss();
          await this.cerrarSesion();
        }, 1500);
      } else {
        console.log("tatas", json.message);
        await this.alertValidaciones("Error", json.message);
      }
    } catch (e) {
      console.error("tatas ERROR AL INTENTAR EDITAR LA CONTRASEÑA: ", JSON.stringify(e));
      await this.alertValidaciones("Error", "Hubo un error al guardar los datos. Intenta nuevamente más tarde");
    }
  }

  //alert validaciones y errores
  //creado por david el 10/05
  async alertValidaciones(titulo: string, mensaje: string) {
    let alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"]
    });
    await alerta.present();
  }

  //metodo para cerrar sesion
  //creado por david el 23/04
  async cerrarSesion() {
    let extras: NavigationExtras = {replaceUrl: true}
    await this.borrarUsuarioLogueado(); //borrar los datos de la tabla
    this.router.navigate(["login"], extras);
  }

  //borrar registros en la tabla local usuario
  //creado por david el 23/04
  async borrarUsuarioLogueado() {
    await this.dbOff.borrarUsuarioLogueado();
  }

}