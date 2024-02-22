import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {UserCreateComponent} from "../user-create/user-create.component";
import {DialogRef} from "@angular/cdk/dialog";

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{
  dataSource: User[];
  displayedColumns: string[] = ['userId', 'name', 'lastName', 'role'];
  private dialogRef: MatDialogRef<UserCreateComponent>;


  ngOnInit(): void {
    this.getUsers();
  }

  constructor(private authService: AuthService,
              private matDialog: MatDialog) {
  }

  getUsers() {
    this.authService.getUsers().subscribe({
      next: (users: User[]) => {
        this.dataSource = users;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  addUser() {
    const dialogConfig = new MatDialogConfig();
       this.dialogRef = this.matDialog.open(UserCreateComponent,dialogConfig);
       this.dialogRef.afterClosed().subscribe(() =>{
         this.getUsers();
       })
  }

}
