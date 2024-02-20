import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class JwtToken {

  token: string;

  /**
   * It returns the token from local storage, or null if there is no token
   * String has to be parsed like this as sessionStorage can only hold key value pairs, no objects
   *
   * @return The token from local storage.
   */
  getTokenFromSessionStorage() {
    let token: string | null = sessionStorage.getItem('token');
    if (token) {
      return JSON.parse(token)
    }
  }


}


