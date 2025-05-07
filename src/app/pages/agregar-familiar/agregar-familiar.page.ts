import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonButton } from '@ionic/angular/standalone';
import { DbOffService } from 'src/app/services/db-off.service';
import { ApiFamiliaresService } from 'src/app/services/api-familiares.service';
import { FamiliarRegistro, FamiliarRegistrado } from 'src/app/interfaces/familiar';
import { NavigationExtras, Router } from '@angular/router';
import { Contacts, Contact, ContactFieldType } from '@awesome-cordova-plugins/contacts/ngx';
import { Platform } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-agregar-familiar',
  templateUrl: './agregar-familiar.page.html',
  styleUrls: ['./agregar-familiar.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel],
  providers: [Contacts]
})
export class AgregarFamiliarPage implements OnInit {

  idUsuarioLogueado: number = 0; //usuario registrado
  contactos: { nombre: string; numero: string }[] = []; // Contactos del teléfono
  contactosApi: { telefono: string; id_usuario: number }[] = []; //contactos que vienen de la api
  contactosCoincidentes: { nombre: string; numero: string; id_usuario: number; bloqueado: boolean }[] = []; // Contactos que coinciden entre teléfono y API
  contactosSeleccionados: { nombre: string; numero: string; id_usuario: number }[] = []; //contactos seleccionados para agregar al grupo familiar
  familiaresRegistrados: { id_usuario: number }[] = []; //familiares registrados por el adulto mayor

  //modelo para agregar familiar
  //creado por david el 02/05
  mdl_familiar: FamiliarRegistro = {
    idAdultoMayor: 0,
    idFamiliar: 0
  }

  constructor(
    private dbOff: DbOffService,
    private apiFamiliares: ApiFamiliaresService,
    private router: Router,
    private contacts: Contacts,
    private platform: Platform,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.obtenerIdUsuarioLogueado(); //obtener id de usuario logueado al abrir la pagina

    //validar si es movil o web
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      await this.obtenerCoincidencias();
    } else {
      console.log("No se puede acceder a los contactos desde navegador");
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

  // Obtiene contactos del teléfono y normaliza números
  //creado por ale el 26/04
  async obtenerContactos() {
    const fields: ContactFieldType[] = ['displayName', 'phoneNumbers'];

    try {
      const encontrados = await this.contacts.find(fields, { multiple: true });

      this.contactos = encontrados
        .map(c => ({
          nombre: c.displayName || 'Sin nombre',
          numero: c.phoneNumbers && c.phoneNumbers.length && c.phoneNumbers[0].value
            ? this.normalizarNumero(c.phoneNumbers[0].value)
            : ''
        }))
        .filter(c => c.numero !== '')
        .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Orden alfabético

    } catch (error) {
      console.error('Error al obtener contactos del teléfono:', error);
    }
  }

  // Obtiene teléfonos registrados desde la API (como arreglo)
  //creado por ale el 26/04
  async obtenerContactosApi() {
    try {
      const data: FamiliarRegistrado[] = await lastValueFrom(
        this.apiFamiliares.obtenerContactosFamiliar()
      );
  
      this.contactosApi = data.map(contacto => ({
        telefono: this.normalizarNumero(contacto.telefono),
        id_usuario: contacto.id_usuario
      }));
    } catch (error) {
      console.error('Error al obtener contactos desde la API:', error);
    }
  }

  // Compara y guarda solo los contactos que coinciden por número
  //creado por ale el 26/04
  compararContactos() {
    this.contactosCoincidentes = this.contactos
      .map(contacto => {
        let coincidencia = this.contactosApi.find(api => api.telefono === contacto.numero);
        if (coincidencia) {
          let yaRegistrado = this.familiaresRegistrados.some(familiar => familiar.id_usuario === coincidencia.id_usuario);
          return {
            nombre: contacto.nombre,
            numero: contacto.numero,
            id_usuario: coincidencia.id_usuario,
            bloqueado: yaRegistrado //agregar propiedad que bloquea al contacto en la pantalla
          };
        }
        return null;
      })
      .filter(c => c !== null) as { nombre: string; numero: string; id_usuario: number; bloqueado: boolean }[];
  }

  // Ejecuta toda la lógica
  //creado por ale el 26/04
  async obtenerCoincidencias() {
    await this.obtenerContactos();
    await this.obtenerContactosApi();
    await this.obtenerFamiliaresRegistrados();
    this.compararContactos();
    console.log("tatas CONTACTOS COINCIDENTES", JSON.stringify(this.contactosCoincidentes));
  }

  // Normaliza números quitando +56 y símbolos
  //creado por ale el 26/04
  private normalizarNumero(numero: string): string {
    let numeroNormalizado = numero.replace(/\D/g, '');
    if (numeroNormalizado.startsWith('56')) {
      numeroNormalizado = numeroNormalizado.substring(2);
    }
    return numeroNormalizado;
  }

  //funcion para seleccionar contactos
  //creado por david el 03/05
  seleccionarContacto(contacto: { nombre: string; numero: string; id_usuario: number; bloqueado: boolean }) {
    if (contacto.bloqueado) {
      console.log("Este contacto ya está registrado y no se puede seleccionar");
      return; //no permite seleccionar el contacto si esta bloqueado
    }

    let index = this.contactosSeleccionados.findIndex(c => c.numero === contacto.numero);
    if (index > -1) {
      this.contactosSeleccionados.splice(index, 1); //ya estaba seleccionado, se quita
      console.log(`tatas Contacto deseleccionado - ID: ${contacto.id_usuario}`);
    } else {
      this.contactosSeleccionados.push(contacto); //se selecciona
      console.log(`tatas Contacto seleccionado - ID: ${contacto.id_usuario}`);
    }  
  }

  //llamar funcion seleccionarContacto al hacer click en el contacto
  //creado por david el 03/05
  estaSeleccionado(contacto: { nombre: string; numero: string; id_usuario: number; bloqueado: boolean }): boolean {
    return this.contactosSeleccionados.some(c => c.numero === contacto.numero);
  }

  //funcion para registrar familiares
  //creada por david el 03/05
  async agregarFamiliares() {
    //muestra el loading al agregar familiares
    let loading = await this.loadingController.create({
      message: 'Agregando familiar...',
      backdropDismiss: false, //bloquea la pantalla
      spinner: 'circles',
    });
    await loading.present();

    for (let contacto of this.contactosSeleccionados) {
      let familiar: FamiliarRegistro = {
        idAdultoMayor: this.idUsuarioLogueado,
        idFamiliar: contacto.id_usuario
      };
  
      try {
        let respuesta = await lastValueFrom(this.apiFamiliares.registrarFamiliar(familiar));
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        console.log("tatas:", json.status);
  
        if (json.status == "success") {
          console.log("tatas:", json.message);
        }
      } catch (error: any) {
        let respuestaError = JSON.parse(JSON.stringify(error.error));
        console.log("tatas:", respuestaError.message);
      }
    }
    console.log("tatas: Proceso de registro de familiares completado.");
    await this.obtenerCoincidencias(); //actualiza la lista de contactos coincidentes
    this.contactosSeleccionados = []; //limpia la lista de contactos seleccionados

    await loading.dismiss(); //cierra el loading
    this.regresarFamiliares();
  }

  //obtener los familiares registrados por este adulto mayor para bloquear los que ya estan registrados
  //creado por david el 07/05
  async obtenerFamiliaresRegistrados() {
    try {
      let data = await lastValueFrom(this.apiFamiliares.obtenerFamiliaresRegistrados(this.idUsuarioLogueado));
      this.familiaresRegistrados = data.map(familiar => ({
        id_usuario: familiar.familiar_rel.id_usuario
      }));
      console.log("tatas FAMILIARES YA AGREGADOS: ", this.familiaresRegistrados);
    } catch (e) {
      console.error("tatas Error al obtener familiares registrados:", e);
    }
  }

  //navegar a pagina central de familiares
  //creado por david el 07/05
  regresarFamiliares() {
    let extras: NavigationExtras = {replaceUrl: true};
    this.router.navigate(["familiares"], extras);
  }

}