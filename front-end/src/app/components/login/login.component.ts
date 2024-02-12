import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onLogin(): void {
    // Add your login logic here
    console.log('Username:', this.loginForm.get('email')?.value, 'Password:', this.loginForm.get('password')?.value);
    // You might want to authenticate against a backend service
  }
}
