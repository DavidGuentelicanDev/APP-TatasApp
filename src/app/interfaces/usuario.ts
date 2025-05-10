import { Direccion } from "./direccion";

//interfaz para el registro de usuario
//creado por andrea el 19/04
export interface Usuario {
    mdl_nombres: string;
    mdl_apellidos: string;
    mdl_fecha_nacimiento: string; // Si prefieres, puedes usar `Date`, pero como lo ingresas desde un input tipo string, este es más flexible.
    mdl_correo_electronico: string;
    mdl_telefono: string;
    mdl_tipo_usuario: number;
    mdl_contrasena: string;
    mdl_confirmarContrasena: string;
    direccion: Direccion;
}

//interfaz para login
//creado por david el 20/04
export interface UsuarioLogin {
    correo: string;
    contrasena: string;
}

//interfaz para la respuesta de login exitoso
//creado por david el 21/04
export interface UsuarioLoginExitoso {
    id_usuario: number
    nombres: string
    tipo_usuario: number
    token: string
}

//interfaz para obtener los datos del usuario logueado
//creado por david el 28/04
export interface UsuarioLogueado {
    id_usuario: number
    nombres: string
    tipo_usuario: number
}

//interfaz para obtener los datos de usuario por id
//creado por david el 07/05
export interface UsuariosPorId {
    nombres: string
    apellidos: string
    fecha_nacimiento: Date
    correo: string
    tipo_usuario: number
    direccion_rel: Direccion
}

//interfaz para actualizar foto de perfil
//creado por david el 09/05
export interface FotoPerfil {
    id: number;
    foto_perfil: string;
}

//interfaz para editar datos de usuario
//creado por david el 09/05
export interface DatosUsuarioEditar {
    id: number;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    telefono: string
    direccion: Direccion
}