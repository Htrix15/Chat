import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatExpansionPanel } from '@angular/material/expansion';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'ClientApp';
  @ViewChild('header') header: MatExpansionPanel;
  public showLable:boolean;

  constructor(private router: Router){
    this.showLable = false;
  }

  ngOnInit(): void {
  }

  routeTo(route:string){
    this.router.navigate([`/${route}`]);
    this.header.close();
  }

}
