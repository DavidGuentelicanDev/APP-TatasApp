import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/inicio/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./pages/inicio/registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'principal',
    loadComponent: () => import('./pages/principal/principal.page').then( m => m.PrincipalPage)
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/inicio/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'mapa-prueba',
    loadComponent: () => import('./pages/mapa-prueba/mapa-prueba.page').then( m => m.MapaPruebaPage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./pages/inicio/registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./pages/evento/eventos/eventos.page').then( m => m.EventosPage)
  },
  {
    path: 'crear-evento',
    loadComponent: () => import('./pages/evento/crear-evento/crear-evento.page').then( m => m.CrearEventoPage)
  },
  {
    path: 'familiares',
    loadComponent: () => import('./pages/familiar/familiares/familiares.page').then( m => m.FamiliaresPage)
  },
  {
    path: 'agregar-familiar',
    loadComponent: () => import('./pages/familiar/agregar-familiar/agregar-familiar.page').then( m => m.AgregarFamiliarPage)
  },
  {
    path: 'registro-alarmas',
    loadComponent: () => import('./pages/registro-alarmas/registro-alarmas.page').then( m => m.RegistroAlarmasPage)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/config/configuracion/configuracion.page').then( m => m.ConfiguracionPage)
  },
  {
    path: 'foto-perfil',
    loadComponent: () => import('./pages/config/foto-perfil/foto-perfil.page').then( m => m.FotoPerfilPage)
  },
  {
    path: 'editar-datos-usuario',
    loadComponent: () => import('./pages/config/editar-datos-usuario/editar-datos-usuario.page').then( m => m.EditarDatosUsuarioPage)
  },
  {
    path: 'editar-correo',
    loadComponent: () => import('./pages/config/editar-correo/editar-correo.page').then( m => m.EditarCorreoPage)
  },
  {
    path: 'editar-contrasena',
    loadComponent: () => import('./pages/config/editar-contrasena/editar-contrasena.page').then( m => m.EditarContrasenaPage)
  },
  {
    path: 'evento-familiar',
    loadComponent: () => import('./pages/evento/evento-familiar/evento-familiar.page').then( m => m.EventoFamiliarPage)
  },
  {
    path: 'modificar-evento/:id',
    loadComponent: () => import('./pages/evento/modificar-evento/modificar-evento.page').then( m => m.ModificarEventoPage)
  },
  {
    path: 'home-tata',
    loadComponent: () => import('./pages/home/home-tata/home-tata.page').then( m => m.HomeTataPage)
  },
  {
    path: 'home-familiar',
    loadComponent: () => import('./pages/home/home-familiar/home-familiar.page').then( m => m.HomeFamiliarPage)
  },



];