import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {UserCreateComponent} from "../user-create/user-create.component";
import {UserDetailComponent} from "../user-detail/user-detail.component";
import {first} from "rxjs";
import {LastWarningComponent} from "../last-warning/last-warning.component";

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  activeUsers: User[];
  deActivatedUsers: User[];
  displayedColumns: string[] = ['userId', 'name', 'lastName', 'role', 'actions'];
  private dialogRefUserCreate: MatDialogRef<UserCreateComponent>;
  private dialogRefUserDetails: MatDialogRef<UserDetailComponent>;
  private roles: string [];

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
  }

  constructor(private authService: AuthService,
              public matDialog: MatDialog
  ) {
  }

  getUsers() {
    this.authService.getUsers().subscribe({
      next: (users: User[]) => {
        let activeUsers: User[] = [];
        let deActivatedUsers: User[] = [];
        for (const user of users) {

          if (user.active) {
            activeUsers.push(user);
          } else {
            deActivatedUsers.push(user);
          }
          this.activeUsers = activeUsers;
          this.deActivatedUsers = deActivatedUsers;
        }
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  addUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogRefUserCreate = this.matDialog.open(UserCreateComponent, dialogConfig);
    this.dialogRefUserCreate.afterClosed().subscribe(() => {
      this.getUsers();
    })
  }

  openUserDetail(email: string) {
    this.authService.getUser(email).subscribe({
      next: (user: User) => {
        this.dialogRefUserDetails = this.matDialog.open(UserDetailComponent, {
          data: {
            user: user,
            roles: this.roles
          }
        });
        this.dialogRefUserDetails.afterClosed().subscribe({
          next: (isChanged) => {
            if (isChanged) {
              this.getUsers();
            }
          }
        })
      }, error: err => {
        console.log(err)
        this.authService.toastr.error("There was an unexpected error getting customer details!", "Error")
      }
    });
  }

  private getRoles() {
    this.authService.getRoles().pipe(first()).subscribe({
      next: (roles: string[]) => {
        this.roles = roles;
      }
    });
  }

  onChangeUserStatus(user: User, isActive: boolean) {
    let messagePart: string;
    if (isActive) {
      messagePart = "activate"
    } else {
      messagePart = "deactivate"
    }
    let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
      data: {
        message: "Do you really want to " + messagePart + " this user: " +
          "\n\t " + user.email
      }
    });
    dialogRefLastWarn.afterClosed().subscribe({
      next: (changeRequested: boolean) => {
        if (changeRequested) {
          this.setUserStatus(user, isActive);
        }
      }, error: (err) => {
        console.log(err)
      }
    });
  }

  private setUserStatus(user: User, isActive: boolean) {

    if (isActive != null) {

      let updatedUser: User = new User();
      updatedUser.cloneUser(user);
      updatedUser.setActiveStatus(isActive);

      this.authService.updateUser(updatedUser).subscribe({
        next: (user: User) => {
          if (user.active == isActive) {
            this.getUsers();
            this.authService.toastr.success("User status for " + user.email + " was changed successfully!");
          } else {
            this.authService.toastr.error("An unexpected error occurred while changing status of the user " + user.email + "!!!")
          }

        },
        error: () => {
          this.authService.toastr.error("An unexpected error occurred while changing status of the user " + user.email + "!!!")
        }
      });
    }
  }
}
