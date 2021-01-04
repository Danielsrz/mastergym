import { DocumentReference } from "@angular/fire/firestore";

export class Inscripcion{
    fecha: Date;
    fechaFinal: Date;
    cliente: DocumentReference;
    precios: DocumentReference;
    subtotal: number;
    iva: number;
    total: number;

    constructor(){
        this.fecha = null;
        this.fechaFinal = null;
        this.cliente = this.cliente;    
        this.precios = this.precios;
        this.subtotal = this.subtotal;
        this.iva = this.iva;
        this.total = this.total;
    }

    validar(): any{
        let respuesta = {
            esValido: false,
            mensaje: ''
        }

        if(this.cliente == null || this.cliente == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "Por favor seleccione un cliente";
            return respuesta;
        } 
        if(this.precios == null || this.precios == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "Por favor seleccione un precio";
            return respuesta;
        }
        if(this.fecha == null || this.fecha == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "No tiene fecha de inicio";
            return respuesta;
        }
        if(this.fechaFinal == null || this.fechaFinal == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "No tiene fecha de finalización";
            return respuesta;
        }
        if(this.subtotal <= 0 || this.subtotal == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "No se pudo calcular el subtotal";
            return respuesta;
        }
        if(this.iva <= 0 || this.iva == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "No se pudo calcular el iva";
            return respuesta;
        }
        if(this.total <= 0 || this.total == undefined){
            respuesta.esValido = false;
            respuesta.mensaje = "No se pudo calcular el total";
            return respuesta;
        }
        respuesta.esValido = true;
        return respuesta;
    }
}