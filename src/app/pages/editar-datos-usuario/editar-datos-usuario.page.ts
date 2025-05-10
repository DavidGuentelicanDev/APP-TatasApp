import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonButton, IonInput, IonDatetime } from '@ionic/angular/standalone';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DatosUsuarioEditar } from 'src/app/interfaces/usuario';
import { AlertController, LoadingController } from '@ionic/angular';


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
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
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

    this.datosUsuario.nombres = json.nombres;
    this.datosUsuario.apellidos = json.apellidos;
    this.datosUsuario.fecha_nacimiento = json.fecha_nacimiento;
    this.datosUsuario.telefono = json.telefono;
    this.datosUsuario.direccion.direccion_texto = json.direccion_rel.direccion_texto;
    this.datosUsuario.direccion.adicional = json.direccion_rel.adicional;
  }

  //guardar los datos editados
  //creado por david el 09/05
  async guardarCambios() {
    //validacion campos vacios
    if (
      !this.datosUsuario.nombres ||
      !this.datosUsuario.apellidos ||
      !this.datosUsuario.fecha_nacimiento ||
      !this.datosUsuario.telefono ||
      !this.datosUsuario.direccion.direccion_texto
    ) {
      console.log("tatas CAMPOS VACIOS");
      await this.alertaValidaciones("Error", "Tienes un campo vacío. Debes completar todos los campos (excepto Adicional)");
      return;
    }

    //validacion fecha nacimiento no puede ser fecha futura
    let fechaNacimiento = new Date(this.datosUsuario.fecha_nacimiento);
    let hoy = new Date();
    //fechas formateadas
    let fechaNacimientoStr = this.formatearFecha(fechaNacimiento);
    let hoyStr = this.formatearFecha(hoy);
    //comparar fechas
    if (fechaNacimientoStr > hoyStr) {
      console.log("tatas FECHA DE NACIMIENTO FUTURA NO VÁLIDA");
      await this.alertaValidaciones("Error", "No puedes seleccionar una fecha futura como fecha de nacimiento");
      return;
    }

    //validacion formato telefono
    const telefonoRegex = /^9\d{8}$/;
    if (!telefonoRegex.test(this.datosUsuario.telefono)) {
      console.log("tatas FORMATO DE TELEFONO NO VÁLIDO");
      await this.alertaValidaciones("Error", "El teléfono debe tener formato 9XXXXXXXX");
      return;
    }

    //loading
    let loading = await this.loadingController.create({
      message: 'Guardando los cambios...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();

    try {
      //convertir la fecha a formato yyyy-mm-dd
      let fechaFormateada = fechaNacimiento.toISOString().split('T')[0]; //formato "yyyy-mm-dd"

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
      console.log("tatas", json.message);
      await loading.dismiss();

      //alerta para edicion de datos correcto
      if (json.status === "success") {
        let alertaExito = await this.alertController.create({
          header: "Éxito",
          message: "Datos guardados y actualizados correctamente",
          backdropDismiss: false
        });
        await alertaExito.present();

        setTimeout(async() => {
          await alertaExito.dismiss();
          await this.router.navigate(["configuracion"], {replaceUrl: true});
        }, 1500);
      } else {
        await loading.dismiss();
        await this.alertaValidaciones("Error", json.message);
        return;
      }
    } catch (e) {
      console.error("tatas: Error al actualizar datos", JSON.stringify(e));
      await loading.dismiss();
      await this.alertaValidaciones("Error", "Hubo un problema al guardar los datos. Intenta nuevamente más tarde");
    }
  }

  //funcion para formatear fecha
  //creado por david el 10/05
  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  //alert para validaciones
  //creado por david el 10/05
  async alertaValidaciones(titulo: string, mensaje: string) {
    let alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"]
    });
    await alerta.present();
  }

}