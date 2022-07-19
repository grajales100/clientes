import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService:AuthService,
              private router: Router) { 

  }

  ngOnInit(): void {
  }

  logout():void{
    Swal.fire('logout',`Hola ${this.authService.usuario.username}, has cerrado sesion con éxito!`,'success');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
