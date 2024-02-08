import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {User} from "../../models/user.model";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  createUser(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add other headers as needed
    });
    return this.http.post(this.hostname + "createUser", user, {headers});
  }
}
