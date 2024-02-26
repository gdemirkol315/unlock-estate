import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  @Input('user')
  user: User;

  ngOnInit(): void {
  }


  changePassword() {

  }

}
