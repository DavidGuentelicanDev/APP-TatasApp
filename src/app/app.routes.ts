import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./pages/registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'principal',
    loadComponent: () => import('./pages/principal/principal.page').then( m => m.PrincipalPage)
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'mapa-prueba',
    loadComponent: () => import('./pages/mapa-prueba/mapa-prueba.page').then( m => m.MapaPruebaPage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./pages/registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./pages/eventos/eventos.page').then( m => m.EventosPage)
  },
  {
    path: 'crear-evento',
    loadComponent: () => import('./pages/crear-evento/crear-evento.page').then( m => m.CrearEventoPage)
  },
  {
    path: 'familiares',
    loadComponent: () => import('./pages/familiares/familiares.page').then( m => m.FamiliaresPage)
  },
  {
    path: 'agregar-familiar',
    loadComponent: () => import('./pages/agregar-familiar/agregar-familiar.page').then( m => m.AgregarFamiliarPage)
  },
  {
    path: 'registro-alarmas',
    loadComponent: () => import('./pages/registro-alarmas/registro-alarmas.page').then( m => m.RegistroAlarmasPage)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then( m => m.ConfiguracionPage)
  },
  {
    path: 'foto-perfil',
    loadComponent: () => import('./pages/foto-perfil/foto-perfil.page').then( m => m.FotoPerfilPage)
  },
  {
    path: 'editar-datos-usuario',
    loadComponent: () => import('./pages/editar-datos-usuario/editar-datos-usuario.page').then( m => m.EditarDatosUsuarioPage)
  },
  {
    path: 'editar-correo',
    loadComponent: () => import('./pages/editar-correo/editar-correo.page').then( m => m.EditarCorreoPage)
  },
  {
    path: 'editar-contrasena',
    loadComponent: () => import('./pages/editar-contrasena/editar-contrasena.page').then( m => m.EditarContrasenaPage)
  },
  {
    path: 'evento-familiar',
    loadComponent: () => import('./pages/evento-familiar/evento-familiar.page').then( m => m.EventoFamiliarPage)
  },
  {
    path: 'modificar-evento/:id',
    loadComponent: () => import('./pages/modificar-evento/modificar-evento.page').then( m => m.ModificarEventoPage)
  },  {
    path: 'home-tata',
    loadComponent: () => import('./pages/home-tata/home-tata.page').then( m => m.HomeTataPage)
  },
  {
    path: 'home-familiar',
    loadComponent: () => import('./pages/home-familiar/home-familiar.page').then( m => m.HomeFamiliarPage)
  },



];