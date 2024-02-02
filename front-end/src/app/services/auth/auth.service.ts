import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {User} from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  createUser(user: User) {
    return this.http.post(this.hostname + "createUser", User);
  }
}
