import { Component, OnInit, Input, Inject } from '@angular/core';
import { MyMessage } from 'src/app/services-classes/my-message';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent{

  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: MyMessage) { }

}
