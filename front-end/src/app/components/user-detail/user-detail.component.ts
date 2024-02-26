import {Component, Inject, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";
import {first} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LastWarningComponent} from "../last-warning/last-warning.component";

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
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onSave() {
    let updatedUser = this.getUserFromObject(this.userDetailForm);
    updatedUser.setActiveStatus(this.user.active);
    if (this.isUserDetailsChanged(updatedUser)) {
      let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
        data: {
          message:"Are you sure to save changes for user:"
            +"\n\t" + this.user.name + " " + this.user.lastName
        }
      });
      dialogRefLastWarn.afterClosed().pipe(first()).subscribe({
        next: (answer)=>{
          if (answer){
            this.save(updatedUser);
          }
        }, error: (err)=>{
          console.log(err)
          this.authService.toastr.error("An unexpected error occurred while trying to save user details!")
        }
      });
    } else {
      this.isEditMode = false;
      this.initializeForm();
      this.authService.toastr.info("No user detail has been changed!")
    }
  }

  onClose() {
    this.dialogRefUserDetail.close(this.isEdited);
  }


  private initializeForm(): void {
    this.userDetailForm = new FormGroup({
      userId: new FormControl({value: this.user.userId, disabled: true}),
      name: new FormControl({value: this.user.name, disabled: true}),
      lastName: new FormControl({value: this.user.lastName, disabled: !this.isEditMode}),
      email: new FormControl({value: this.user.email, disabled: !this.isEditMode}),
      role: new FormControl({value: this.user.role, disabled: !this.isEditMode}),
      phoneNumber: new FormControl({value: this.user.phoneNumber, disabled: !this.isEditMode}),
      preferredArea: new FormControl({value: this.user.preferredArea, disabled: !this.isEditMode})
    });
  }

  onEditMode() {
    this.isEditMode = true;
    this.initializeForm();
  }

  private getUserFromObject(obj:any): User {
    let updatedUser = new User();
    if (obj instanceof FormGroup){
      updatedUser.email = this.userDetailForm.get('email')?.value;
      updatedUser.lastName = this.userDetailForm.get('lastName')?.value;
      updatedUser.phoneNumber = this.userDetailForm.get('phoneNumber')?.value;
      updatedUser.preferredArea = this.userDetailForm.get('preferredArea')?.value;
      updatedUser.role = this.userDetailForm.get('role')?.value;
      updatedUser.active = this.userDetailForm.get('active')?.value;
      updatedUser.isActive = this.userDetailForm.get('isActive')?.value;
    } else {
      updatedUser.email = obj['email'];
      updatedUser.lastName = obj['lastName'];
      updatedUser.phoneNumber = obj['phoneNumber'];
      updatedUser.preferredArea = obj['preferredArea'];
      updatedUser.role = obj['role'];
      updatedUser.active = obj['active'];
      updatedUser.isActive = obj['isActive'];
    }

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
          let userInstance: User = this.getUserFromObject(user);
          this.user = userInstance;
          console.log(user)
          console.log(userInstance)
          this.isEditMode = false;
          this.isEdited = true;
          this.initializeForm();
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
