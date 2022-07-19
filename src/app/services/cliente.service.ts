import { Injectable } from '@angular/core';
import { Cliente } from '../components/clientes/cliente.interface';
import { CLIENTES } from '../components/clientes/clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { DatePipe, formatDate } from '@angular/common';
import { Region } from '../components/clientes/region';
import { AuthService } from '../usuarios/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private url: string = 'http://localhost:8080/api/clientes';
  
  

  //private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) { }
  
  /* private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer ' + token)
    }
    return this.httpHeaders;
  } */

 /*  private isNoAutorizado(e):boolean{
    if(e.status==401){

      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }

      this.router.navigate(['/login'])
      return true;
    }
    if(e.status==403){
      Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,'warning');
      this.router.navigate(['/clientes'])
      return true;
    }
    return false;
  } */

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.url+'/regiones');
  }

  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.url);
    return this.http.get(this.url+'/page/'+page)
      .pipe(
        tap( (response:any) => {
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        }),
        map((response:any) => {
          (response.content as Cliente[]).map(cliente=> {
            cliente.nombre = cliente.nombre.toUpperCase();
            //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US')
            
            //let datePipe = new DatePipe('es');
            //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
            return cliente;
          });
          return response;
        })
      )
  }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.url,cliente).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e=>{

        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){

          console.error(e.error.mensaje);
          Swal.fire(
            e.error.mensaje,
            e.error.error,
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  getCliente(id:string):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`)
      .pipe(
        catchError(e=>{

          if(e.status != 401 && e.error.mensaje){
            
            this.router.navigate(['/clientes']);
            console.error(e.error.mensaje);
            Swal.fire(
              'Error al editar',
              e.error.mensaje,
              'error'
            );
          }

          return throwError(e);
        }
        )
      )
  }

  actualizar(cliente: Cliente):Observable<Cliente>{
    return this.http.put(`${this.url}/${cliente.id}`,cliente).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e=>{
        if(e.status==400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
          Swal.fire(
            e.error.mensaje,
            e.error.error,
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  eliminar(id:number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError(e=>{
        /* if(this.isNoAutorizado(e)){
          return throwError(e);
        } */
        if(e.error.mensaje){
          console.error(e.error.mensaje);
          Swal.fire(
            e.error.mensaje,
            e.error.error,
            'error'
          );
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo:File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.url}/upload`,formData,{
      reportProgress:true
    });

    return this.http.request(req);
  }

}
