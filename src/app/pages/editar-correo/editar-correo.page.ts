import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CorreoEditar } from 'src/app/interfaces/usuario';


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
  validarCorreoIngresado() {
    this.correoValido = this.correoIngresado.trim().toLowerCase() === this.correoUsuario.trim().toLowerCase();
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
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(this.nuevoCorreo)) {
      console.log("tatas FORMATO DE CORREO NO VÁLIDO");
      return;
    }

    if (this.nuevoCorreo != this.correoConfirmar) {
      console.log("tatas LOS CORREOS NO COINCIDEN");
      return;
    }

    //falta validar que el correo no este registrado previamente

    try {
      let datos = this.apiConfig.editarCorreo(this.datosCorreo);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log("tatas", json.message);
    } catch (e) {
      console.error("tatas ERROR AL INTENTAR EDITAR EL CORREO: ", JSON.stringify(e));
    }
  }

}