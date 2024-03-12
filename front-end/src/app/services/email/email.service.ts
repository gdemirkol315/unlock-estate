import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {Email} from "../../models/email.model";

@Injectable({
  providedIn: 'root'
})
export class EmailService extends DataService {

  private servicePrefix: string = "email";

  send(email: Email, toastrMessage:string) {
    this.http.post(this.hostname + this.servicePrefix + "/send", email).subscribe({
      next:()=>{
        this.toastr.success(toastrMessage)
      }
    })
  }
}
