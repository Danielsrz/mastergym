import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  porcentajeSubida: number = 0;
  urlImagen: string = '';
  esEditable: boolean = false;
  id: string;

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private msj: MensajesService
    ) { }

  ngOnInit(): void {
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      DNI: [''],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      imgUrl: ['', Validators.required]
    })

    this.id = this.activeRoute.snapshot.params.clienteID;
    if(this.id != undefined){
      this.esEditable = true;
      this.db.doc<any>('clientes/'+this.id).valueChanges().subscribe((cliente)=>{
        this.formularioCliente.setValue({
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          correo: cliente.correo,
          DNI: cliente.DNI,
          fechaNacimiento: new Date(cliente.fechaNacimiento.seconds * 1000).toISOString().substr(0,10),
          telefono: cliente.telefono,
          imgUrl: ''
        })
  
      this.urlImagen = cliente.imgUrl;
      })
    }
  }

  agregar(){
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino)=>{
      this.msj.mensajeCorrecto('Guardar', 'Se guardó correctamente');
      this.router.navigate(['/listado-clientes']);
    })
  }

  editar(){
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);

    this.db.doc('clientes/' + this.id).update(this.formularioCliente.value).then(()=>{
      this.msj.mensajeCorrecto('Editar', 'Se editó correctamente');
      this.router.navigate(['/listado-clientes']);
    }).catch(()=>{
      this.msj.mensajeError('Error', 'Hubo un problema al guardar')
    })
  }

  subirImagen(evento){
    if(evento.target.files.length > 0){
      let nombre = new Date().getTime().toString();
      let archivo = evento.target.files[0];
      let extension = archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'));
      let ruta = 'clientes/'+ nombre + extension;
      const ref = this.storage.ref(ruta);
      const tarea = ref.put(archivo);
      tarea.then((objeto)=>{
        ref.getDownloadURL().subscribe((url)=>{
          this.urlImagen = url;
        })
      })
      tarea.percentageChanges().subscribe((porcentaje)=>{
        this.porcentajeSubida = parseInt(porcentaje.toString());
      })
    }
  }
}
