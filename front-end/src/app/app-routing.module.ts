import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/user-login/login.component";
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {UserManagementComponent} from "./components/user-management/user-management.component";
import {RealEstateManagementComponent} from "./components/real-estate-management/real-estate-management.component";
import {TaskOverviewComponent} from "./components/task-management/task-overview.component";
import {authGuardGuard} from "./guard/auth-guard.guard";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user-create',
    component: UserCreateComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'real-estate-management',
    component: RealEstateManagementComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'task-management',
    component: TaskOverviewComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
