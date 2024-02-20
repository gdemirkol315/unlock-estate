import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {User} from "../../models/user.model";
import {HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {JwtToken} from "../../models/jwt-token.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  isLoggedIn: boolean = false;
  redirectUrl: string | null = null;

  login(user: User){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers as needed
    });
    return this.http.post<JwtToken>(this.hostname + "login", user, {headers}).subscribe({
      next: (jwtToken: JwtToken) => {
        sessionStorage.setItem('token',jwtToken.token);
        this.isLoggedIn = true;
        this.toastr.success("Successfully logged in");
        this.router.navigate(['/user-create']);
      },
      error: (err) => {
        this.isLoggedIn = false;
        console.log(err);
      }
    });

  }

  createUser(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers as needed
    });
    return this.http.post<User>(this.hostname + "register", user, {headers});
  }
}
