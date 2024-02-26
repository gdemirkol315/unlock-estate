import { Component, inject} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {LoginComponent} from "../user-login/login.component";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss'
})
export class MainNavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  constructor(protected authService:AuthService) {
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  protected readonly LoginComponent = LoginComponent;

  logout() {
    this.authService.logout()
  }
}
