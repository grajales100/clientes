import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from './cliente.interface';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/clientes/detalle/modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  
  clientes: Cliente[]=[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clientesService: ClienteService,
              private router : Router,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,
              public authService: AuthService) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe( params =>{
      let page = +params.get('page');

      if(!page){
        page = 0;
      }

      this.clientesService.getClientes(page)
        .subscribe((response:any)=>{
          this.clientes = response.content;
          this.paginador = response;
        })
      });

      this.modalService.notificarUpload.subscribe(cliente => {
        this.clientes = this.clientes.map(clienteOriginal =>{
          if(cliente.id == clienteOriginal.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        })
      })
  }

  editar(id:string){
    this.router.navigate(['/formulario',id])
  }

  delete(cliente:Cliente){
    Swal.fire({
      title: 'Esta seguro?',
      text: `seguro que quiere eliminar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3035d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clientesService.eliminar(cliente.id)
          .subscribe(eliminar => {
            this.clientes = this.clientes.filter(cli => cli !==cliente)
            Swal.fire(
              'Cliente Eliminado!',
              'se ha eliminado con exito',
              'success'
            )
          })
      } 
    })
  }
  
  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
