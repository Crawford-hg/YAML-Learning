import { Component } from '@angular/core';
import {  LabelModel } from '../../../models/label/label';

@Component({
  selector: 'app-label',
  imports: [],
  templateUrl: './label.html',
  styleUrl: './label.css',
})
export class Label implements LabelModel {
  name!: string;
  color!: string;


}
