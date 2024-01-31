import { Component } from '@angular/core';
import {User} from "../../models/user.model";

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  user:User = new User();

  onCreateUser() {

  }
}
