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

  user: User;
  private isLoading: boolean = true;
  userDetailForm: FormGroup;
  isEditMode: boolean = false;
  roles: string[];

  ngOnInit() {
    this.initializeForm();
  }

  constructor(private authService: AuthService,
              private dialogRefUserDetail: MatDialogRef<UserDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onSave() {

  }

  onClose() {
    this.dialogRefUserDetail.close();
  }


  private initializeForm(): void {
    this.userDetailForm = new FormGroup({
      name: new FormControl({value: this.data.user.name, disabled: true}),
      lastName: new FormControl({value: this.data.user.lastName, disabled: true}),
      email: new FormControl({value: this.data.user.email, disabled: true}),
      role: new FormControl({value: this.data.user.role, disabled: true})
    });
    this.roles = this.data.roles
  }

  onEditMode() {

  }
}
