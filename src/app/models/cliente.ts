import { DocumentReference } from "@angular/fire/firestore";

export class Cliente{
    nombre: string;
    apellido: string;
    correo: string;
    fechaNacimiento: Date;
    imgUrl: string;
    telefono: number;
    DNI: string;
    ref: DocumentReference;
    visible: boolean;

    constructor(){}
}