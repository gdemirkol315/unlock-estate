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
    this.changePassword.newPassword = this.passwordChangeForm.get('newPassword')?.value;
    this.changePassword.user.password = this.passwordChangeForm.get('oldPassword')?.value;
    this.authService.changePassword(this.changePassword)
    this.matDialogRef.close();
  }

  onCancel() {
    this.matDialogRef.close();
  }


}
