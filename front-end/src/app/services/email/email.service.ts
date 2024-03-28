import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {Email} from "../../models/email.model";

@Injectable({
  providedIn: 'root'
})
export class EmailService extends DataService {

  private servicePrefix: string = "notification";

  send(email: Email) {
    return this.http.post(this.hostname + this.servicePrefix + "/sendEmail", email)
  }
}
