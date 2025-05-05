import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { ZonaSeguraService } from '../../services/zona-segura.service';
import { DbOffService } from '../../services/db-off.service';
import { IonList, IonItem, IonLabel } from "@ionic/angular/standalone";
import { SosService } from 'src/app/services/sos.service';
import { ApiAlertasService } from 'src/app/services/api-alertas.service';

@Component({
  selector: 'app-registro-alarmas',
  templateUrl: './registro-alarmas.page.html',
  styleUrls: ['./registro-alarmas.page.scss'],
  imports: [IonItem, IonList, IonLabel, CommonModule],
})
export class RegistroAlarmasPage implements OnInit {
  alertas: any[] = [];
  tipoAlertas: { [key: number]: string } = {
    1: "Zona Segura",
    2: "Inactividad",
    3: "Caída",
    4: "SOS"
  };
  cargando: boolean = true;

  constructor(
    private zonaSegura: ZonaSeguraService,
    private dbOffService: DbOffService,
    private alertController: AlertController,
    private sos: SosService,
    private apiAlertas: ApiAlertasService
  ) {}

  async ngOnInit() {
    try {
      const usuario = await this.dbOffService.obtenerDatosUsuarioLogueado();

      if (usuario?.tipo_usuario !== 2) {
        this.mostrarAlerta('Acceso restringido', 'Esta página solo está disponible para usuarios familiares.');
        this.cargando = false;
        return;
      }
      const res: any = await this.apiAlertas.getAlertasPorFamiliar(usuario.id_usuario);
      this.alertas = res.data || [];
    } catch (err) {
      console.error('Error al cargar alertas:', err);
      this.mostrarAlerta('Error', 'No se pudieron cargar las alertas.');
    } finally {
      this.cargando = false;
    }
  }

  getNombreTipoAlerta(tipo: number): string {
    return this.tipoAlertas[tipo] || 'Alerta';
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alerta.present();
  }

}