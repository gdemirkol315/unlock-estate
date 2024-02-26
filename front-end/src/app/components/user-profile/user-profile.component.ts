import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LastWarningComponent} from "../last-warning/last-warning.component";
import {first, firstValueFrom} from "rxjs";
import {Utils} from "../../utils/utils";
import {JwtToken} from "../../models/jwt-token.model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user: User = new User();
  isEditMode: boolean = false;
  isLoading:boolean = true;
  userDetailForm: FormGroup;

  constructor(private authService: AuthService,
              private matDialog: MatDialog,
              private jwtToken:JwtToken) {
  }

  async ngOnInit(): Promise<void> {
    this.user.cloneUser(await firstValueFrom(this.authService.getUser(this.jwtToken.getUserEmail())));
    this.userDetailForm = Utils.initializeUserDetailForm(this.user, this.isEditMode);
    this.isLoading = false;
  }


  changePassword() {

  }

  onSave() {
    let updatedUser = Utils.getUserFromObject(this.userDetailForm);
    updatedUser.setActiveStatus(this.user.active);
    updatedUser.role = this.user.role
    if (Utils.isUserDetailsChanged(updatedUser,this.user)) {
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
      this.userDetailForm = Utils.initializeUserDetailForm(this.user,this.isEditMode);
      this.authService.toastr.info("No user detail has been changed!")
    }
  }

  private save(updatedUser: User) {

    this.authService.updateProfile(updatedUser).pipe(first())
      .subscribe({
        next: (user: User) => {
          if (user) {
            let userInstance: User = Utils.getUserFromObject(user);
            this.user = userInstance;
            this.isEditMode = false;
            this.userDetailForm = Utils.initializeUserDetailForm(this.user,this.isEditMode);
            this.authService.toastr.success("User profile has been updated.");
          }
        },
        error: (err) => {
          console.log(err);
          this.authService.toastr.error("There was an unexpected error while updating the user details! No changes has been applied!");
        }
      });

  }

  onEditMode() {
    this.isEditMode = true;
    this.userDetailForm = Utils.initializeUserDetailForm(this.user,this.isEditMode);
  }
}
