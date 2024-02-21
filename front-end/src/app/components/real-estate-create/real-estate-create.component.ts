import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'real-estate-create',
  templateUrl: './real-estate-create.component.html',
  styleUrl: './real-estate-create.component.scss'
})
export class RealEstateCreateComponent {
  createReForm: FormGroup;
  reTypes: string[] = ['apartment','villa','room'];

  constructor(private formBuilder: FormBuilder) {
    this.createReForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      addressDetail: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      reType: ['', [Validators.required]]
    });
  }

  onCreateRe() {

  }
}
