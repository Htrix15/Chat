import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(private router: Router,
    private route: ActivatedRoute){
    this.showLable = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if(params['cg']){
        this.header.close();
      }
    });
  }

  routeTo(route:string){
    this.router.navigate([`/${route}`]);
    this.header.close();
  }

}
