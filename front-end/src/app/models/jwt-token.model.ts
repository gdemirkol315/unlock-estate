import {Injectable} from "@angular/core";
import {jwtDecode} from "jwt-decode";

@Injectable({providedIn: "root"})
export class JwtToken {

  token: string;
  roles: string[]
  sub: string;
  timer: Date = new Date()

  constructor() {
  }

  getRole() {
    const decoded: JwtToken = jwtDecode(this.token);
    this.roles = decoded.roles
    return this.roles;
  }


  clear() {
    this.token = ""
    this.roles = []
  }

  getUserEmail() {
    const decoded: JwtToken = jwtDecode(this.token);
    this.sub = decoded.sub
    return this.sub;
  }
}


