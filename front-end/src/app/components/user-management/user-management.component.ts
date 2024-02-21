import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{
  dataSource: User[];
  displayedColumns: string[] = ['userId', 'name', 'lastName', 'role'];


  constructor(private authService: AuthService) {
  }

  getUsers() {
    this.authService.getUsers().subscribe({
      next: (users) => {
        console.log(users)
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  addUser() {

  }

  ngOnInit(): void {
    this.getUsers();
  }
}
