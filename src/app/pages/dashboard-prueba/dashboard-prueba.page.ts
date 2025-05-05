import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DbOffService } from 'src/app/services/db-off.service';

@Component({
  selector: 'app-dashboard-prueba',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './dashboard-prueba.page.html',
  styleUrls: ['./dashboard-prueba.page.scss'],
})
export class DashboardPruebaPage implements OnInit {

  constructor(
    private dbOff: DbOffService,
    private router: Router
  ) { }

  ngOnInit() {}

  //borrar registros en la tabla local usuario
  //creado por david el 23/04
  async borrarUsuarioLogueado() {
    await this.dbOff.borrarUsuarioLogueado();
  }

  //metodo para cerrar sesion
  //creado por david el 23/04
  async cerrarSesion() {
    let extras: NavigationExtras = {replaceUrl: true};

    await this.borrarUsuarioLogueado(); //borrar los datos de la tabla

    this.router.navigate(["login"], extras);
  }

}

