import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/components/clientes/cliente.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { ModalService } from './modal.service';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturasService } from 'src/app/facturas/services/facturas.service';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del Cliente";
  progreso:number = 0;
  private fotoSeleccionada:File;
  constructor(private clienteService:ClienteService,
              private activateRoute: ActivatedRoute,
              public modalService: ModalService,
              public authService: AuthService,
              private facturasService:FacturasService) { }

  ngOnInit(): void {
   /*  this.activateRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id)
            .subscribe(cliente=>this.cliente = cliente)
      }
    }) */
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso=0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error selecionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }  
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      Swal.fire('Error Upload: ', 'debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          } else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
            
            this.modalService.notificarUpload.emit(this.cliente);

            Swal.fire(
              'La foto se ha subido completamente!','La foto se ha subido con exito', 'success'
            );
          }
          //this.cliente = cliente;
          
        }
      );
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
  
  delete(factura:Factura):void{
    Swal.fire({
      title: 'Esta seguro?',
      text: `seguro que quiere eliminar la factura ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3035d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.facturasService.delete(factura.id)
          .subscribe(eliminar => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !==factura)
            Swal.fire(
              'Factura Eliminada!',
              'se ha eliminado con exito',
              'success'
            )
          })
      } 
    })
  }

}
