import {Component} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { MatCardModule} from "@angular/material/card";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string;
  password: string;

  onLogin(): void {
    // Add your login logic here
    console.log('Username:', this.username, 'Password:', this.password);
    // You might want to authenticate against a backend service
  }
}
