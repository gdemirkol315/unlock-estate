import { Component } from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  protected myForm: FormGroup;

  constructor(private authService:AuthService, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      repeatedPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  user:User = new User();

  onCreateUser() {
    console.log(this.myForm)
    console.log(this.myForm.invalid);
    this.authService.createUser(this.user).subscribe({
      next: () => {
        this.authService.toastr.success("User for "+ this.user.email + " has been successfully created.")
      },
      error: (err) => {
        console.log(err)
        this.authService.toastr.error("User "+ this.user.email + " could not be created! The user might already exist.")
      }
    })
  }
}
