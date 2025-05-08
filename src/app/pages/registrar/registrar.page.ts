import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { ApiUsuariosService } from 'src/app/services/api-usuarios.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


declare var google: any;


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class RegistrarPage implements OnInit {

  autocomplete: any;

  usuario: Usuario = {
    mdl_nombres: '',
    mdl_apellidos: '',
    mdl_fecha_nacimiento: '', // puede ser string inicialmente si se convierte después
    mdl_correo_electronico: '',
    mdl_telefono:  '',
    mdl_tipo_usuario: 0,
    mdl_contrasena: '',
    mdl_confirmarContrasena: '',
    direccion: {
      direccion_texto: '',
      adicional: '',
    }
  };

  constructor(
    private alertController: AlertController,
    private api: ApiUsuariosService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {}

  ngAfterViewInit() {
  //para la direccion recomendada de google places
  //agregado por david el 08/05
    const input = document.getElementById('autocomplete') as HTMLInputElement;

    if (!input || !google || !google.maps || !google.maps.places) {
      console.error('tatas Google Maps Places no está disponible todavía.');
      return;
    }

    this.autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'], //solo direcciones
      componentRestrictions: { country: 'cl' } //chile
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place || !place.formatted_address) {
        console.error('tatas Dirección no válida seleccionada');
        return;
      }

      //guardar solo la dirección como string
      this.usuario.direccion.direccion_texto = place.formatted_address;
      console.log('tatas Dirección seleccionada:', this.usuario.direccion.direccion_texto);
    });
  }

  //para la direccion de google places
  //agregado por david el 08/05
  onDireccionInputChange(event: any) {
    const value = event.target.value;
    this.usuario.direccion.direccion_texto = value;
  }

  async registrarUsuario() {
    const u = this.usuario;
    if (
      !u.mdl_nombres ||
      !u.mdl_apellidos ||
      !u.mdl_fecha_nacimiento ||
      !u.direccion.direccion_texto ||
      !u.mdl_correo_electronico ||
      !u.mdl_telefono ||
      u.mdl_tipo_usuario === null || u.mdl_tipo_usuario === undefined ||
      !u.mdl_contrasena ||
      !u.mdl_confirmarContrasena
    ) {
      this.presentAlert('Error', 'Todos los campos son obligatorios');
      return;
    }
    

    if (u.mdl_contrasena !== u.mdl_confirmarContrasena) {
      this.presentAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const fechaNacimientoStr = u.mdl_fecha_nacimiento.split('T')[0]; // "2025-04-01"
    const [year, month, day] = fechaNacimientoStr.split('-').map(Number);
    const fechaConvertida = new Date(Date.UTC(year, month - 1, day)); // Hora cero en UTC

    //loading para cubrir el tiempo que demora crear el usuario
    let loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();

    try {
      await this.api.registrar_usuario(
        u.mdl_nombres,
        u.mdl_apellidos,
        fechaConvertida,
        u.mdl_correo_electronico,
        u.mdl_telefono,
        u.mdl_tipo_usuario,
        u.mdl_contrasena,
        u.direccion 
      ).toPromise();

      await loading.dismiss(); //desaparece el loading

      //alert especial sólo para el registro exitoso
      let alertaExito = await this.alertController.create({
        header: "Éxito",
        message: "Usuario registrado correctamente",
      });
      await alertaExito.present();

      setTimeout(async() => {
        await alertaExito.dismiss();
        this.regresarLogin();
      }, 1000);

    } catch (error: any) {
      // 🟡 Captura mensaje de error detallado desde la API
      console.error('tatas Error completo:', error);
  
      let mensaje = 'Ocurrió un error inesperado';
  
      // Si el backend manda un mensaje más claro, lo mostramos
      if (error?.error?.detail) {
        mensaje = error.error.detail;
      } else if (error?.message) {
        mensaje = error.message;
      } else if (typeof error === 'string') {
        mensaje = error;
      }

      //this.presentAlert('Error', mensaje);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  limpiarFormulario() {
    this.usuario = {
      mdl_nombres: '',
      mdl_apellidos: '',
      mdl_fecha_nacimiento: '',
      direccion: {
        direccion_texto: '',
        adicional: '',
      },
      mdl_correo_electronico: '',
      mdl_telefono: '',
      mdl_tipo_usuario: 0,
      mdl_contrasena: '',
      mdl_confirmarContrasena: ''
    };
  }

  regresarLogin() {
    let extras: NavigationExtras = {replaceUrl: true};
    this.router.navigate(["login"], extras);
  }

}