import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonAvatar, IonLabel, IonItem, IonIcon } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { ApiFamiliaresService } from 'src/app/services/api/api-familiares.service';
import { FamiliarRegistrado } from 'src/app/interfaces/familiar';
import { DbOffService } from 'src/app/services/db-off.service';
import { lastValueFrom } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ApiConfigService } from 'src/app/services/api/api-config.service';


@Component({
  selector: 'app-familiares',
  templateUrl: './familiares.page.html',
  styleUrls: ['./familiares.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonAvatar, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem]
})
export class FamiliaresPage implements OnInit {

  idUsuarioLogueado: number = 0; //usuario logueado
  familiaresRegistrados: FamiliarRegistrado[] = []; //lista recepcionar infor de familiares registrados
  fotoPerfilBase64: string | null = null; //para guardar la foto de perfil base64

  constructor(
    private router: Router,
    private apiFamiliares: ApiFamiliaresService,
    private dbOff: DbOffService,
    private alertController: AlertController,
    private apiConfig: ApiConfigService
  ) { }

  async ngOnInit() {
    await this.obtenerIdUsuarioLogueado(); //obtener el id del usuario logueado
    await this.cargarFamiliaresRegistrados(); //cargar familiares registrados al iniciar la pagina
    await this.obtenerFotoPerfil();
  }

  async ionViewWillEnter() {
    await this.obtenerIdUsuarioLogueado(); //obtener el id del usuario logueado
    await this.cargarFamiliaresRegistrados(); //cargar familiares registrados al volver a la pagina
    await this.obtenerFotoPerfil();
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

  //navega a la pagina de registrar familiar
  //creado por david el 02/05
  navegarAgregarFamiliar() {
    this.router.navigate(["agregar-familiar"]);
  }

  async cargarFamiliaresRegistrados() {
    try {
      let data = await lastValueFrom(this.apiFamiliares.obtenerFamiliaresRegistrados(this.idUsuarioLogueado));

      //ordenar los campos por nombres
      data.sort((a, b) => {
        let nombres = a.familiar_rel.nombres.toLowerCase();
        let apellidos = b.familiar_rel.nombres.toLowerCase();
        return nombres.localeCompare(apellidos);
      });
      this.familiaresRegistrados = data;

      console.log("tatas FAMILIARES REGISTRADOS: ", JSON.stringify(this.familiaresRegistrados));
    } catch (e) {
      console.error("tatas Error al obtener familiares registrados:", e);
    }
  }

  //metodo para eliminar un familiar
  //creado por david el 07/05
  async eliminarFamiliar(idFamiliar: number) {
    let alertaConfirmacion = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar a este familiar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await lastValueFrom(this.apiFamiliares.eliminarFamiliar(this.idUsuarioLogueado, idFamiliar));
              console.log("tatas familiar eliminado correctamente");
              //alerta de exito
              await this.mostrarAlertasResultadoDeEliminar(
                "Éxito",
                "Familiar eliminado correctamente"
              );
              await this.cargarFamiliaresRegistrados(); //actualiza la vista de los familiares
            } catch (e) {
              console.error("tatas: error al eliminar familiar", e);
              //alerta de error
              await this.mostrarAlertasResultadoDeEliminar(
                "Error",
                "Hubo un problema al eliminar el familiar. Inténtelo más tarde"
              );
            }
          }
        }
      ]
    });
    await alertaConfirmacion.present();
  }

  //metodo para crear alerta generica de respuesta al eliminar familiar (exito o error)
  //creado por david el 07/05
  async mostrarAlertasResultadoDeEliminar(titulo: string, mensaje: string) {
    let alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alerta.present();
  }

  //obtener foto de perfil
  //creado por david el 09/05
  async obtenerFotoPerfil() {
    try {
      let data = this.apiConfig.obtenerFotoPerfil(this.idUsuarioLogueado);
      let respuesta = await lastValueFrom(data);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      this.fotoPerfilBase64 = json.foto_perfil;
      console.log("tatas foto perfil: ", this.fotoPerfilBase64);
    } catch (e) {
      console.error("tatas error al obtener la foto de perfil:", e);
    }
  }

}