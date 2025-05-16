import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { DbOffService } from 'src/app/services/db-off.service';
import { NavigationExtras, Router } from '@angular/router';
import { ApiPruebaService } from 'src/app/services/api/api-prueba.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  constructor(
    private dbOff: DbOffService,
    private router: Router,
    private apiPrueba: ApiPruebaService
  ) { }

  async ngOnInit() {
    //ruta raiz de la api
    this.apiPrueba.obtenerRutaRaiz().subscribe({
      next: (res) => console.log('tatas: Respuesta de API:', JSON.stringify(res, null, 2)),
      error: (err) => console.error('tatas: Error detallado:', JSON.stringify(err, null, 2))
    });

    this.dbOff.abrirDB(); //habilita la base de datos
    this.dbOff.crearTablaUsuario(); //crea o valida tabla usuario
    await this.validarDBOff(); //llamar validacion de token y tipo usuario | modificado por david el 16/05
  }

  //funcion para navegar a la pagina indicada, reemplaza a las anteriores
  //creada por david el 16/05
  navegarA(ruta: string) {
    let extras: NavigationExtras = { replaceUrl: true };
    this.router.navigate([ruta], extras);
  }

  //validar que haya token de usuario registrado
  //creado por david el 01/05
  async validarDBOff() {
    //si no hay token, navega a login
    let token = await this.dbOff.obtenerTokenUsuarioLogueado();
    if (!token) {
      console.log("tatas: no hay token registrado, navegando a login");
      setTimeout(() => this.navegarA("login"), 500);
      return;
    }

    //si hay token, segun tipo de usuario navega a ...
    let usuario = await this.dbOff.obtenerDatosUsuarioLogueado();
    if (usuario?.tipo_usuario === 1) {
      console.log(`tatas Usuario logueado tipo ${usuario.tipo_usuario}, navegando a home tata`);
      setTimeout(() => this.navegarA("home-tata"), 500);
    } else if (usuario?.tipo_usuario === 2) {
      console.log(`tatas Usuario logueado tipo ${usuario.tipo_usuario}, navegando a home tata`);
      setTimeout(() => this.navegarA("home-familiar"), 500);
    } else {
      console.log('tatas Usuario logueado de tipo desconocido, navegando a login');
      setTimeout(() => this.navegarA("login"), 500);
    }
  }

}
