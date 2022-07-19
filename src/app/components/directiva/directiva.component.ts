import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {
  
  lista: string[] = ['jscrip','java','spring']
  
  habilitar: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
