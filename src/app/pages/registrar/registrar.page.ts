//import { NgZone } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { ApiUsuariosService } from 'src/app/services/api-usuarios.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//declaracion global para google
// declare global {
//   interface Window {
//     google: any;
//   }
// }

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class RegistrarPage implements OnInit {

   //variables para la direccion
  //  direccion: string | null = null;
  //  placeAutocompleteElement: any = null;


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
    //private zone: NgZone,

  ) {}

  async ngOnInit() {
  //  await this.initAutocomplete();
  }

  // async initAutocomplete() {
  //   try {
  //     if (!window.google) {
  //       throw new Error('Google Maps API no está cargada');
  //     }
      
  //     const { PlaceAutocompleteElement } = await window.google.maps.importLibrary("places");
  //     const container = document.getElementById('autocomplete-container');
      
  //     if (container) {
  //       // Limpiar el contenedor primero
  //       container.innerHTML = '';
        
  //       this.placeAutocompleteElement = new PlaceAutocompleteElement({
  //         types: ["address"],
  //         componentRestrictions: { country: "cl" }
  //       });
        
  //       container.appendChild(this.placeAutocompleteElement);
  //       console.log('Elemento autocomplete creado:', this.placeAutocompleteElement);
  //       console.log('Contenedor:', container.innerHTML);
  //       this.placeAutocompleteElement.addEventListener('place_changed', () => {
  //         const place = this.placeAutocompleteElement.getPlace();
  //         console.log('llega aca?')
  //         if (place?.formatted_address) {
  //           this.zone.run(() => {
  //             this.usuario.direccion.direccion_texto = place.formatted_address;
  //           });
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error inicializando autocomplete:', error);
  //     this.presentAlert('Error', 'No se pudo cargar el buscador de direcciones');
  //   }
  // }
  // ngAfterViewInit() {
  //   const element = document.getElementById('autocomplete');
  
  //   if (element) {
  //     console.log('✅ <gmpx-place-autocomplete> encontrado');
  
  //     element.addEventListener('gmpx-placechange', (event: any) => {
  //       const place = event.detail;
  //       console.log('📦 Evento recibido:', place);
  
  //       if (place.formatted_address) {
  //         this.usuario.direccion.direccion_texto = place.formatted_address;
  //         console.log('✅ Dirección guardada:', this.usuario.direccion.direccion_texto);
  //       }
  //     });
  //   } else {
  //     console.warn('⚠️ No se encontró <gmpx-place-autocomplete>');
  //   }
  // }
  
  
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
      this.presentAlert('Éxito', 'Usuario creado correctamente');
      this.limpiarFormulario();

    } catch (error: any) {
      // 🟡 Captura mensaje de error detallado desde la API
      console.error('Error completo:', error);
  
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

}
