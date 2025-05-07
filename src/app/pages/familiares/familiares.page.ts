import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonAvatar, IonLabel, IonItem } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';
import { ApiFamiliaresService } from 'src/app/services/api-familiares.service';
import { FamiliarRegistrado } from 'src/app/interfaces/familiar';
import { DbOffService } from 'src/app/services/db-off.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-familiares',
  templateUrl: './familiares.page.html',
  styleUrls: ['./familiares.page.scss'],
  standalone: true,
  imports: [IonLabel, IonAvatar, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem]
})
export class FamiliaresPage implements OnInit {

  idUsuarioLogueado: number = 0; //usuario logueado
  familiaresRegistrados: FamiliarRegistrado[] = []; //lista recepcionar infor de familiares registrados

  constructor(
    private router: Router,
    private apiFamiliares: ApiFamiliaresService,
    private dbOff: DbOffService
  ) { }

  async ngOnInit() {
    await this.obtenerIdUsuarioLogueado(); //obtener el id del usuario logueado
    await this.cargarFamiliaresRegistrados(); //cargar familiares registrados al iniciar la pagina
  }

  async ionViewWillEnter() {
    await this.cargarFamiliaresRegistrados(); //cargar familiares registrados al volver a la pagina
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

}
