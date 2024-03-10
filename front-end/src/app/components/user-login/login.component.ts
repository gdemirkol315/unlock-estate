import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  hide: boolean = true;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onLogin() {
    let user: User = new User();
    user.email = this.loginForm.get('email')?.value;
    user.password = this.loginForm.get('password')?.value;
    user.role = 'NONE';
    await this.authService.login(user);
    this.authService.getUserProfile(user.email);
  }

  toggleHide() {
    this.hide = !this.hide;
  }
}
