import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {User} from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  createUser(user: User) {
    this.http.post(this.hostname + "/createUser", User).subscribe({
      next: () => {
        this.toastr.success("User for "+ user.email + " has been successfully created.")
      },
      error: (err) => {
        console.log(err)
        this.toastr.error("User "+ user.email + " could not be created! The user might already exist.")
      }
    })
  }
}
