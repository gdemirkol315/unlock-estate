import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {User} from "../../models/user.model";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {JwtToken} from "../../models/jwt-token.model";
import {ChangePasswordComponent} from "../../components/change-password/change-password.component";
import {ChangePassword} from "../../models/password-change.model";

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
        if (jwtTokenObj.token != "" && jwtTokenObj.token != "deactivated") {
          this.jwtToken.token = jwtTokenObj.token
          this.isLoggedIn = true;
          this.toastr.success("Successfully logged in");
          this.router.navigate(['task-overview']);
        } else if (jwtTokenObj.token == "") {
          this.toastr.error("Provided credentials are wrong!","Wrong Credentials")
        } else if (jwtTokenObj.token == "deactivated") {
          this.toastr.error("User account is deactivated! Contact system administrator!","Deactivated Account")
        } else {
          this.toastr.error("There was an unexpected error during login!","Unexpected Problem")
        }
      },
      error: (err) => {
        this.isLoggedIn = false;
        console.log(err);
        this.toastr.error("There was an unexpected error on the server during login!","Connection Problem")
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

    getServiceStaff() {
    return this.http.get<User[]>(this.hostname + "allServiceStaff");
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

  updateProfile(user: User) {
    return this.http.post<User>(this.hostname + 'updateProfile', user);
  }

  changePassword(changePassword:ChangePassword){
    this.http.post<JwtToken>(this.hostname + "changePassword", changePassword).subscribe({
      next:(jwtTokenObj: JwtToken) => {
        if (jwtTokenObj.token != "") {
          this.jwtToken.token = jwtTokenObj.token
          this.toastr.success("Successfully change password");
        } else {
          this.toastr.error("Password entered wrong!");
        }
      }, error: (err) => {
        console.log(err);
        this.toastr.error("There was an unexpected error during password change!","Connection Problem")
      }
    })
  }

  logout() {
    this.isLoggedIn = false;
    this.jwtToken.clear()
    this.router.navigate(['/']);
  }

  getAssigneeUser(taskId: number) {

    let params = new HttpParams().set('taskId',taskId);

    return this.http.get<User>(this.hostname + 'getAssigneeWithTaskId', {params});
  }

  getCreatorUser(taskId: number) {

    let params = new HttpParams().set('taskId',taskId);

    return this.http.get<User>(this.hostname + 'getCreatorWithTaskId', {params});
  }
}
