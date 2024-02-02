import { Component } from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  constructor(private authService:AuthService) {
  }
  user:User = new User();
  repeatedPass: string;

  onCreateUser() {
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
