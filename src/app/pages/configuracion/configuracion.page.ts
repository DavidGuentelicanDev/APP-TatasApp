import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { DbOffService } from 'src/app/services/db-off.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConfiguracionPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  previewImage: string | null = null;

  idUsuarioLogueado: number = 0;
  fotoPerfilBase64: string | null = null; //para guardar la foto de perfil base64

  constructor(
    private router: Router,
    private dbOff: DbOffService,
    private apiConfig: ApiConfigService
  ) { }

  async ngOnInit() {
    await this.obtenerIdUsuarioLogueado();
    await this.obtenerFotoPerfil();
  }

  async ionViewWillEnter() {
    await this.obtenerIdUsuarioLogueado();
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

  navegarFotoPerfil() {
    this.router.navigate(["foto-perfil"]);
  }

  navegarEditarDatosUsuario() {
    this.router.navigate(["editar-datos-usuario"]);
  }

  navegarEditarCorreo() {
    this.router.navigate(["editar-correo"]);
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
