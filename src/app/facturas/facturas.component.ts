import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  
  titulo:string = 'Nueva Factura';
  factura:Factura = new Factura();
  
  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private activateRoute: ActivatedRoute,
              private facturaService: FacturasService,
              private router:Router) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params =>{
      let clienteId = params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente =>{
        this.factura.cliente = cliente;
      })
    })
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string'? value : value.nombre),
        flatMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue)
  }
  
  mostrarNombre(producto?:Producto): string | undefined{
    return producto ? producto.nombre : undefined;
  }
  
  seleccionarProducto(event):void{
    let producto = event.option.value as Producto;

    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    
    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }
  
  actualizarCantidad(idProducto:number, event:any):void{
    let cantidad:number = event.target.value as number;
    if(cantidad<=0){
      return this.eliminar(idProducto);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(idProducto === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    })
  }

  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item:ItemFactura) =>{
      if(id === item.producto.id){
        existe = true;
      }
    })
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    })
  }

  eliminar(id:number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  created(){
    this.facturaService.create(this.factura).subscribe(factura => {
      Swal.fire(this.titulo,`Factura ${factura.descripcion} creada con éxito!`,'success');
      this.router.navigate(['/facturas', factura.id]);
    });
  }
  
}
