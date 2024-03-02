import {CanMatchFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {JwtToken} from "../models/jwt-token.model";

export const authGuardGuard: CanMatchFn = (route, segments) => {
  const router = inject( Router);
  const authService:AuthService = inject(AuthService);
  const jwtToken:JwtToken =inject(JwtToken)

  if (route.path?.includes("admin")){
    if (jwtToken.getRole().includes("ADMIN")){
      return true;
    } else {
      return false;
      authService.toastr.error("Unauthorized! Access denied!")
    }
  }

  return authService.isLoggedIn;
};
