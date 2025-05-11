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

  autocomplete: any; //para el autocompletado de la direccion
  fechaMaximaHoy: string = new Date().toISOString().split('T')[0];

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.mdl_correo_electronico)) {
      this.presentAlert('Error', 'El correo electrónico debe tener formato correo@example.com');
      return;
    }

    if (!/^9\d{8}$/.test(u.mdl_telefono)) {
      this.presentAlert('Error', 'El teléfono debe comenzar con 9 y tener 9 dígitos en total');
      return;
    }

    if (u.mdl_contrasena !== u.mdl_confirmarContrasena) {
      this.presentAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regexPassword.test(u.mdl_contrasena)) {
      this.presentAlert('Error', 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.');
      return;
    }

    const fechaNacimientoStr = u.mdl_fecha_nacimiento.split('T')[0]; // "2025-04-01"
    const [year, month, day] = fechaNacimientoStr.split('-').map(Number);
    const fechaConvertida = new Date(Date.UTC(year, month - 1, day)); // Hora cero en UTC
    const hoy = new Date();

    if (fechaConvertida > hoy) {
      this.presentAlert('Error', 'La fecha de nacimiento no puede ser futura');
      return;
    }

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
      await loading.dismiss();
      // 🟡 Captura mensaje de error detallado desde la API
      console.error('tatas Error completo:', JSON.stringify(error));
      console.error("tatas ERROR ESPECIFICO", JSON.stringify(error?.error));

      if (error?.error?.message === "Correo ya registrado") {
        this.presentAlert("Error", `${error?.error?.message}, debes ingresar otro correo electrónico`);
      } else if (error?.error?.message === "Telefono ya registrado") {
        this.presentAlert("Error", `${error?.error?.message}, debes ingresar otro teléfono`);
      } else {
        this.presentAlert("Error", "No se pudo registrar tu usuario. Inténtelo nuevamente más tarde");
      }
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