import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule, LocationStrategy, PathLocationStrategy } from "@angular/common";


@NgModule({
  declarations: [ 
  ],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  ],
  providers:[
      [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
     ],
  exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  ]
})
export class SharedModule { }
