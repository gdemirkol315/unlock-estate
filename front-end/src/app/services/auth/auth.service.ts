import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {User} from "../../models/user.model";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {JwtToken} from "../../models/jwt-token.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  isLoggedIn: boolean = false;
  redirectUrl: string | null = null;

  login(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers as needed
    });
    return this.http.post<JwtToken>(this.hostname + "login", user, {headers}).subscribe({
      next: (jwtTokenObj: JwtToken) => {
        this.jwtToken.token = jwtTokenObj.token
        this.isLoggedIn = true;
        this.toastr.success("Successfully logged in");
        this.router.navigate(['admin/user-management']);
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

  getUsers() {
    return this.http.get<User[]>(this.hostname + "allUsers");
  }

  getUser(email: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers as needed
    });
    let params = new HttpParams().set('email', email);

    return this.http.get<User>(this.hostname + 'user', {headers, params});
  }

  getRoles() {
    return this.http.get<string[]>(this.hostname + "roles");
  }

  updateUser(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers as needed
    });
    return this.http.post<User>(this.hostname + 'updateUser', user);
  }

  deleteUser(user: User) {
    return this.http.delete(`${this.hostname}deleteUser/${user.email}`);
  }

  logout() {
    this.isLoggedIn = false;
    this.jwtToken.clear()
    this.router.navigate(['/']);
  }
}
