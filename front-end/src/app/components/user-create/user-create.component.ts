import {Component} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {Validators} from "@angular/forms";
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  protected createUserForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.createUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      repeatedPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]]
    });
  }

  user: User = new User();
  roles: String[] = [
    'USER',
    'ADMIN'
  ];

  onCreateUser() {
    this.user.email = this.createUserForm.get('email')?.value;
    this.user.name = this.createUserForm.get('name')?.value;
    this.user.lastName = this.createUserForm.get('lastName')?.value;
    this.user.password = this.createUserForm.get('password')?.value;
    this.user.role = this.createUserForm.get('role')?.value;
    this.authService.createUser(this.user).subscribe({
      next: (user: User) => {
        this.authService.toastr.success("User for " + this.user.email + " has been successfully created.")
      },
      error: (err) => {
        console.log(err)
        this.authService.toastr.error("User " + this.user.email + " could not be created! The user might already exist.")
      }
    })
  }
}