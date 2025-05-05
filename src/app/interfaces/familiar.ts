//interfaces para comparacion de contactos y usuarios tipo familiar registrados
//creado por ale el 25/04

//interfaces para poder comparar los contactos con los usuarios familiares registrados
export interface FamiliarRegistrado {
    id_usuario: number;
    telefono: string;
}

export interface ContactoAPI {
    nombre: string;
    telefono: string;
}

export interface RespuestaContactosAPI extends FamiliarRegistrado {
    contactos: ContactoAPI[];
}

//interface para registar un familiar
//creado por david el 02/05
export interface FamiliarRegistro {
    idAdultoMayor: number;
    idFamiliar: number;
}