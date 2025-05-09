import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { DbOffService } from 'src/app/services/db-off.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { NavigationExtras, Router } from '@angular/router';
import { FotoPerfil } from 'src/app/interfaces/usuario';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-foto-perfil',
  templateUrl: './foto-perfil.page.html',
  styleUrls: ['./foto-perfil.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FotoPerfilPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  previewImage: string | null = null;

  idUsuarioLogueado: number = 0;

  constructor(
    private dbOff: DbOffService,
    private apiConfig: ApiConfigService,
    private router: Router
  ) { }

  ngOnInit() {
    this.obtenerIdUsuarioLogueado();
  }

  //para poder ir a buscar la imagen a los documentos del celular
  //creado por david el 09/05
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 1024 * 1024) { //validacion de 1Mb
        console.log('tatas La imagen no debe pesar más de 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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

  //metodo para editar la foto de perfil de usuario
  //creeado por david el 09/05
  async editarFotoPerfil() {
    if (!this.previewImage) {
      console.log("tatas No se ha seleccionado una imagen.");
      return;
    }

    let payload: FotoPerfil = {
      id: this.idUsuarioLogueado,
      foto_perfil: this.previewImage
    }

    try {
      let data = this.apiConfig.editarFotoPerfil(payload);
      let respuesta = await lastValueFrom(data);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log("tatas estado: " + json.status + ", mensaje: " + json.message);
    } catch (e) {
      console.error("tatas error al editar la foto de perfil:", e);
    }
  }

}