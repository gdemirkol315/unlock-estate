import {CanMatchFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {JwtToken} from "../models/jwt-token.model";

export const authGuardGuard: CanMatchFn = (route, segments) => {

  function isTokenExpired(dateA: Date): boolean {
    // Calculate the difference in milliseconds between the two dates
    const differenceInMilliseconds = (new Date()).getTime() - dateA.getTime();

    // Calculate the number of milliseconds in 60 minutes
    const sixtyMinutesInMilliseconds = 60 * 60 * 1000;

    // Check if the difference is greater than or equal to 60 minutes
    return differenceInMilliseconds >= sixtyMinutesInMilliseconds;
  }

  const router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const jwtToken: JwtToken = inject(JwtToken)
  if (jwtToken && isTokenExpired(jwtToken.timer)) {
    authService.logout();
  }
  if (route.path?.includes("admin")) {
    if (jwtToken.getRole().includes("ADMIN")) {
      return true;
    } else {
      return false;
      authService.toastr.error("Unauthorized! Access denied!")
    }
  }

  return authService.isLoggedIn;
};


