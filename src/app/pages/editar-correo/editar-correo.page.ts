import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CorreoEditar } from 'src/app/interfaces/usuario';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-editar-correo',
  templateUrl: './editar-correo.page.html',
  styleUrls: ['./editar-correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditarCorreoPage implements OnInit {

  idUsuarioLogueado: number = 0;
  correoUsuario: string = "";
  correoIngresado: string = "";
  correoValido: boolean | null = null; //null = aun no validado, true/false segun resultado
  nuevoCorreo: string = "";
  correoConfirmar: string = "";

  datosCorreo: CorreoEditar = {
    id: 0,
    correo: ""
  };

  constructor(
    private apiConfig: ApiConfigService,
    private dbOff: DbOffService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
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

  //metodo para editar correo
  //creado por david el 10/05
  async editarCorreo() {
    this.datosCorreo = {
      id: this.idUsuarioLogueado,
      correo: this.nuevoCorreo
    };

    if (!this.nuevoCorreo || !this.correoConfirmar) {
      console.log("tatas TODOS LOS CAMPOS SON OBLIGATORIOS");
      await this.alertValidaciones("Error", "Debes ingresar ambos correos para poder guardar");
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(this.nuevoCorreo)) {
      console.log("tatas FORMATO DE CORREO NO VÁLIDO");
      await this.alertValidaciones("Error", "El correo ingresado debe tener formato correo@dominio.com");
      this.nuevoCorreo = "";
      this.correoConfirmar = "";
      return;
    }

    if (this.nuevoCorreo != this.correoConfirmar) {
      console.log("tatas LOS CORREOS NO COINCIDEN");
      await this.alertValidaciones("Error", "Los correos ingresados no coinciden. Ingrésalos nuevamente");
      this.correoConfirmar = "";
      return;
    }

    //falta validar que el correo no este registrado previamente

    let loading = await this.loadingController.create({
      message: 'Actualizando tu correo electrónico...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();

    try {
      let datos = this.apiConfig.editarCorreo(this.datosCorreo);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);

      await loading.dismiss();

      if (json.status === "success") {
        console.log("tatas", json.message);

        let alertaExito = await this.alertController.create({
          header: "Éxito",
          message: `Correo Electrónico actualizado correctamente a ${this.nuevoCorreo}`,
          backdropDismiss: false
        });
        await alertaExito.present();

        setTimeout(async () => {
          await alertaExito.dismiss();
          this.router.navigate(["configuracion"], {replaceUrl: true});
        }, 1500);
      } else {
        console.log("tatas", json.message);
        await this.alertValidaciones("Error", json.message);
      }
    } catch (e) {
      console.error("tatas ERROR AL INTENTAR EDITAR EL CORREO: ", JSON.stringify(e));
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

}