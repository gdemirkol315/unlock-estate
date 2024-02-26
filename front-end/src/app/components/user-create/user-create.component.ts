import {Component} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {Validators} from "@angular/forms";
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  protected createUserForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<UserCreateComponent>) {
    this.createUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      repeatedPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
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
      this.user.email = this.createUserForm.get('email')?.value;
      this.user.name = this.createUserForm.get('name')?.value;
      this.user.lastName = this.createUserForm.get('lastName')?.value;
      this.user.password = this.createUserForm.get('password')?.value;
      this.user.role = this.createUserForm.get('role')?.value;
      this.user.preferredArea = this.createUserForm.get('preferredArea')?.value;
      this.user.phoneNumber = this.createUserForm.get('phoneNumber')?.value;
      this.authService.createUser(this.user).subscribe({
        next: (user: User) => {
          this.authService.toastr.success("User for " + this.user.email + " has been successfully created.")
          this.dialogRef.close(user);
        },
        error: (err) => {
          console.log(err)
          this.authService.toastr.error("User " + this.user.email + " could not be created! The user might already exist.")
          this.dialogRef.close();
        }
      });
    }
  }

  private validateForm(): boolean {
    if (this.createUserForm.get('password')?.value != this.createUserForm.get('repeatedPassword')?.value) {
      this.authService.toastr.error("Passwords do not match!");
      return false;
    } else if (this.createUserForm.invalid) {
      this.authService.toastr.error("Necessary entries should be done!");
      return false;
    }
    return true;
  }

  onCancel(){
    this.dialogRef.close();
  }

}
