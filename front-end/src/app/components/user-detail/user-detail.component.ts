import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";
import {first, Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  user: User = new User();
  private isLoading: boolean = true;
  userDetailForm: FormGroup;
  isEditMode: boolean = false;
  private isEdited: boolean = false;
  roles: string[];

  ngOnInit() {
    this.user = this.data.user;
    this.roles = this.data.roles
    this.initializeForm();
  }

  constructor(private authService: AuthService,
              private dialogRefUserDetail: MatDialogRef<UserDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onSave() {
    let updatedUser = this.getUpdatedUser();
    if (this.isUserDetailsChanged(updatedUser)) {
      this.save(updatedUser);
    } else {
      this.authService.toastr.info("No user detail has been changed!")
    }
    this.isEditMode = false;
    this.initializeForm();
  }

  onClose() {
    this.dialogRefUserDetail.close(this.isEdited);
  }


  private initializeForm(): void {
    this.userDetailForm = new FormGroup({
      userId: new FormControl({value: this.data.user.userId, disabled: true}),
      name: new FormControl({value: this.data.user.name, disabled: true}),
      lastName: new FormControl({value: this.data.user.lastName, disabled: !this.isEditMode}),
      email: new FormControl({value: this.data.user.email, disabled: !this.isEditMode}),
      role: new FormControl({value: this.data.user.role, disabled: !this.isEditMode}),
      phoneNumber: new FormControl({value: this.data.user.phoneNumber, disabled: !this.isEditMode}),
      preferredArea: new FormControl({value: this.data.user.preferredArea, disabled: !this.isEditMode})
    });
  }

  onEditMode() {
    this.isEditMode = true;
    this.initializeForm();
  }

  private getUpdatedUser(): User {
    let updatedUser = new User();
    updatedUser.email = this.userDetailForm.get('email')?.value;
    updatedUser.lastName = this.userDetailForm.get('lastName')?.value;
    updatedUser.phoneNumber = this.userDetailForm.get('phoneNumber')?.value;
    updatedUser.preferredArea = this.userDetailForm.get('preferredArea')?.value;
    updatedUser.role = this.userDetailForm.get('role')?.value;
    return updatedUser;
  }

  private isUserDetailsChanged(updatedUser: User): boolean {
    return !(updatedUser.role === this.user.role
      && updatedUser.preferredArea === this.user.preferredArea
      && updatedUser.phoneNumber === this.user.phoneNumber
      && updatedUser.lastName === this.user.lastName);
  }

  private save(updatedUser: User) {

    this.authService.updateUser(updatedUser).pipe(first())
      .subscribe({
      next: (user: User) => {
        if (user) {
          this.isEdited = true;
          this.user = user;
          this.authService.toastr.success("User with id:" + user.userId + " has been updated.");
        }
      },
      error: (err) => {
        console.log(err);
        this.authService.toastr.error("There was an unexpected error while updating the user details! No changes has been applied!");
      }
    });

  }


}
