import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../components/clientes/cliente.interface';
import { ClienteService } from '../services/cliente.service';


import Swal from 'sweetalert2'
import { Region } from '../components/clientes/region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  titulo:string = "formulario de clientes";
  cliente:Cliente;
  
  errores: string[] = [];
  regiones:Region[] = [];


  constructor(private clienteService: ClienteService,
              private router: Router,
              private activateRoute: ActivatedRoute) { 
                this.cargarCliente();
              }

  ngOnInit(): void {
    console.log(this.cliente)
  }

  cargarCliente(){
    this.activateRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id)
            .subscribe(cliente=>this.cliente = cliente)
      }
    });
    this.clienteService.getRegiones().subscribe(
      regiones => {
        this.regiones = regiones;
      }
    );
  }

  create(){
    console.log("clicked!");
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      response => {
        console.log(response);
        Swal.fire({
          title: 'creado',
          text: 'se creo el cliente con exito',
          icon: 'info',
          confirmButtonText: 'OK'
        })
        this.router.navigate(['/clientes']);
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }

  update(){
    this.cliente.facturas = null;
    this.clienteService.actualizar(this.cliente)
      .subscribe( cliente =>{
        this.router.navigate(['/clientes'])
        Swal.fire({
          title: 'actualizar',
          text: `se actuailizo el cliente ${cliente.nombre} con exito`,
          icon: 'info',
          confirmButtonText: 'OK'
        })
      },
      err => {
        this.errores = err.error.errors as string[];
      }
      )
  }

  compararRegion(o1:Region,o2:Region):boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined? false: o1.id ===o2.id;
  }

}
