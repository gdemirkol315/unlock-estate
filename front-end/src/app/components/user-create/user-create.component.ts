import {Component} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {Validators} from "@angular/forms";
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Utils} from "../../utils/utils";
import {MessageEntity} from "../../models/message-entity.model";
import {SpinnerDialogComponent} from "../spinner-dialog/spinner-dialog.component";
import {first} from "rxjs";
import {isValidPhoneNumber} from "libphonenumber-js";

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  protected createUserForm: FormGroup;
  private phoneNumberCountry;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private dialogRef: MatDialogRef<UserCreateComponent>) {
    this.createUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      preferredArea: [''],
      role: ['', [Validators.required]]
    });
  }

  user: User = new User();
  roles: String[] = [
    'USER',
    'ADMIN'
  ];



  onCreateUser() {

    if (this.validateForm()) {
      this.matDialog.open(SpinnerDialogComponent);
      this.user.email = this.createUserForm.get('email')?.value;
      this.user.name = this.createUserForm.get('name')?.value;
      this.user.lastName = this.createUserForm.get('lastName')?.value;
      this.user.role = this.createUserForm.get('role')?.value;
      this.user.preferredArea = this.createUserForm.get('preferredArea')?.value;
      this.authService.createUser(this.user).pipe(first()).subscribe({
        next: (user: User) => {
          this.dialogRef.close(user);
          this.authService.toastr.success("User for " + this.user.email + " has been successfully created.")
        },
        error: (err) => {
          let messageEntity: MessageEntity = Utils.jsonObjToInstance(new MessageEntity(),err);
          this.authService.toastr.error(messageEntity.message);
        }, complete: ()=>{
          this.matDialog.closeAll();
        }
      });
    }
  }

  private validateForm(): boolean {
    this.user.phoneNumber = this.user.phoneNumber = '+' + this.phoneNumberCountry.dialCode + this.createUserForm.get('phoneNumber')?.value;
    if (!this.validateEmail(this.createUserForm.get('email')?.value)) {
      this.authService.toastr.error("Wrong e-mail format!");
      return false;
    } else if (!isValidPhoneNumber(this.user.phoneNumber, this.phoneNumberCountry)) {
      this.authService.toastr.error("Phone number format is not correct!");
      return false;
    } else if (this.createUserForm.invalid) {
      this.authService.toastr.error("Necessary entries should be done!");
      return false;
    }
    return true;
  }

  validateEmail(email: string): boolean {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return regex.test(email);
  }

  onCancel(){
    this.dialogRef.close();
  }

  setPhoneNumber($event:any) {
    this.phoneNumberCountry = $event
  }
}
