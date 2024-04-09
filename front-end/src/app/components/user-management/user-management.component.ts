import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {UserCreateComponent} from "../user-create/user-create.component";
import {UserDetailComponent} from "../user-detail/user-detail.component";
import {first} from "rxjs";
import {LastWarningComponent} from "../last-warning/last-warning.component";
import {MatTableDataSource} from "@angular/material/table";
import {type} from "node:os";

@Component({
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  activeUsers: MatTableDataSource<User> = new MatTableDataSource<User>();
  deActivatedUsers: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['userId', 'name', 'lastName', 'role', 'actions'];
  private dialogRefUserCreate: MatDialogRef<UserCreateComponent>;
  private dialogRefUserDetails: MatDialogRef<UserDetailComponent>;
  private roles: string [];
  searchKey: string;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
    this.activeUsers.filterPredicate = (data: User, filter: string) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && typeof data[ele] === "string" &&
          data[ele]?.toLowerCase().indexOf(filter) != -1;
      });
    }
    this.deActivatedUsers.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(name => {
        return name != 'actions' && typeof data[name] === "string" &&
          data[name]?.toLowerCase().indexOf(filter) != -1;
      });
    }
  }

  constructor(private authService: AuthService,
              public matDialog: MatDialog
  ) {
  }

  getUsers() {
    this.isLoading = true;
    this.authService.getUsers().pipe(first()).subscribe({
      next: (users: User[]) => {
        let activeUsers: User[] = [];
        let deActivatedUsers: User[] = [];
        for (const user of users) {

          if (user.active) {
            activeUsers.push(user);
          } else {
            deActivatedUsers.push(user);
          }
          this.activeUsers.data = activeUsers;
          this.deActivatedUsers.data = deActivatedUsers;
        }
      },
      error: (err) => {
        console.log(err)
      },complete: ()=>{
        this.isLoading = false;
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
            this.clientSideUpdateUserList(user)
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

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.activeUsers.filter = this.searchKey.trim().toLowerCase();
    this.deActivatedUsers.filter = this.searchKey.trim().toLowerCase();
  }

  private clientSideUpdateUserList(updatedUser: User) {

    let deActivatedUsers: User[] = new Array();
    let activatedUsers: User[] = new Array();

    if (updatedUser.active) {

      this.deActivatedUsers.data.forEach((deactiveUser: User) => {
        if (deactiveUser.userId != updatedUser.userId) {
          deActivatedUsers.push(deactiveUser);
        }
      })
      activatedUsers = this.activeUsers.data;
      activatedUsers.push(updatedUser);
    } else {
      this.activeUsers.data.forEach((activeUser: User) => {
        if (activeUser.userId != updatedUser.userId) {
          activatedUsers.push(activeUser);
        }
      });
      deActivatedUsers = this.deActivatedUsers.data;
      deActivatedUsers.push(updatedUser);
    }

    this.deActivatedUsers.data = deActivatedUsers;
    this.activeUsers.data = activatedUsers;
  }


}
