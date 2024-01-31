import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {JwtToken} from "../../models/jwt-token.model";
import {environment} from "../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Injectable({providedIn: "root"})
export class DataService {

  private _hostname = environment.apiURL;

  constructor(private _http: HttpClient, protected jwtToken: JwtToken, private _toastr: ToastrService) {
  }



  get hostname(): string {
    return this._hostname;
  }

  set hostname(value: string) {
    this._hostname = value;
  }

  get http(): HttpClient {
    return this._http;
  }

  set http(value: HttpClient) {
    this._http = value;
  }

  get toastr(): ToastrService {
    return this._toastr;
  }

  set toastr(value: ToastrService) {
    this._toastr = value;
  }
}
