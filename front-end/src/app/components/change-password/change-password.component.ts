import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChangePassword} from "../../models/password-change.model";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  passwordChangeForm: FormGroup;
  changePassword: ChangePassword = new ChangePassword();

  hidePass = true
  hidePassNew: boolean = true
  hidePassRepeat: boolean = true

  ngOnInit(): void {
    this.changePassword.user = this.data.user
    this.passwordChangeForm = new FormGroup({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      newPasswordRepeat: new FormControl('', Validators.required)
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matDialogRef:MatDialogRef<ChangePasswordComponent>,
              private authService: AuthService) {
  }

  onChangePassword() {
    let newPassword:string = this.passwordChangeForm.get('newPassword')?.value;
    if (newPassword == this.passwordChangeForm.get('newPasswordRepeat')?.value) {
      this.changePassword.newPassword = newPassword;
      this.changePassword.user.password = this.passwordChangeForm.get('oldPassword')?.value;
      this.authService.changePassword(this.changePassword)
      this.matDialogRef.close();
    } else {
      this.authService.toastr.error("Passwords do not match!")
    }
  }

  onCancel() {
    this.matDialogRef.close();
  }


  toggleHide(hideParamName:string) {
    (this as any)[hideParamName] = !(this as any)[hideParamName]
  }
}
