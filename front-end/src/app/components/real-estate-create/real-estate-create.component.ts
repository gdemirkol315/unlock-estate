import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'real-estate-create',
  templateUrl: './real-estate-create.component.html',
  styleUrl: './real-estate-create.component.scss'
})
export class RealEstateCreateComponent {
  createReForm: FormGroup;
  reTypes: string[] = ['apartment','villa','room'];

  onCreateRe() {

  }
}
