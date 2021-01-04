import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Cliente } from '../models/cliente';
import { Inscripcion } from '../models/inscripcion';
import { Precio } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precioSeleccionado: Precio = new Precio();
  idPrecio: string = 'null';
  precios: Precio[] = new Array<Precio>();

  constructor(private db: AngularFirestore,
    private msg: MensajesService,
    private router: Router) { }

  ngOnInit(): void {
    this.db.collection('precios').get().subscribe((resultado)=>{
      resultado.docs.forEach((item)=>{
        let precio = item.data() as Precio;
        precio['id'] = item.id;
        precio['ref'] = item.ref; 
        this.precios.push(precio);
      })
    })
  }

  asignarCliente(cliente: Cliente){
    this.inscripcion.cliente = cliente.ref;
    this.clienteSeleccionado = cliente;
  }

  eliminarCliente(){
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }

  guardar(){
    if(this.inscripcion.validar().esValido){
      let inscripcionAgregar = {
        fecha: this.inscripcion.fecha,
        fechaFinal: this.inscripcion.fechaFinal,
        cliente: this.inscripcion.cliente,
        precios: this.inscripcion.precios,
        subtotal: this.inscripcion.subtotal,
        iva: this.inscripcion.iva,
        total: this.inscripcion.total
      }
      this.db.collection('inscripciones').add(inscripcionAgregar).then((resultado)=>{
        this.inscripcion = new Inscripcion();
        this.clienteSeleccionado = new Cliente();
        this.precioSeleccionado = new Precio();
        this.idPrecio = 'null';
        this.msg.mensajeCorrecto('Inscripción Exitosa', 'La inscripción se guardó correctamente');
        this.router.navigate(['/inscripciones']);
      })
    } else {
      this.msg.mensajeAdvertencia('Advertencia',this.inscripcion.validar().mensaje);
    }
  }

  seleccionarPrecio(id: string) {
    if (id != "null") {

      this.precioSeleccionado = this.precios.find(x => x.id == id);
      this.inscripcion.precios = this.precioSeleccionado.ref;
      this.inscripcion.subtotal = this.precioSeleccionado.costo;
      this.inscripcion.iva = this.inscripcion.subtotal * 0.21;
      this.inscripcion.total = this.inscripcion.subtotal + this.inscripcion.iva;
      this.inscripcion.fecha = new Date();

      if (this.precioSeleccionado.tipoDuracion == 1) {
        let dias: number = this.precioSeleccionado.duracion;
        let fechaFinal =
          new Date(this.inscripcion.fecha.getFullYear(), this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate() + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }

      if (this.precioSeleccionado.tipoDuracion == 2) {
        let dias: number = this.precioSeleccionado.duracion * 7;
        let fechaFinal =
          new Date(this.inscripcion.fecha.getFullYear(), this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate() + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }

      if (this.precioSeleccionado.tipoDuracion == 3) {
        let dias: number = this.precioSeleccionado.duracion * 15;
        let fechaFinal =
          new Date(this.inscripcion.fecha.getFullYear(), this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate() + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }

      if (this.precioSeleccionado.tipoDuracion == 4) {
        let meses: number = this.precioSeleccionado.duracion;
        let fechaFinal =
          new Date(this.inscripcion.fecha.getFullYear(), this.inscripcion.fecha.getMonth() + meses, this.inscripcion.fecha.getDate());
        this.inscripcion.fechaFinal = fechaFinal;
      }

      if (this.precioSeleccionado.tipoDuracion == 5) {
        let years: number = this.precioSeleccionado.duracion;
        let fechaFinal =
          new Date(this.inscripcion.fecha.getFullYear() + years, this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDate());
        this.inscripcion.fechaFinal = fechaFinal;
      }
    } else {
      this.precioSeleccionado = new Precio();
      this.inscripcion.fecha = null;
      this.inscripcion.fechaFinal = null;
      this.inscripcion.precios = null;
      this.inscripcion.subtotal = 0;
      this.inscripcion.iva = 0;
      this.inscripcion.total = 0;
    }
  }
}
