import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/user-login/login.component";
import {CreateUserComponent} from "./components/user-create/create-user.component";
import {UserManagementComponent} from "./components/user-management/user-management.component";
import {RealEstateManagementComponent} from "./components/real-estate-management/real-estate-management.component";
import {TaskOverviewComponent} from "./components/task-management/task-overview.component";
import {authGuardGuard} from "./guard/auth-guard.guard";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user-create',
    component: CreateUserComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'user-management',
    component: UserManagementComponent
  },
  {
    path: 'real-estate-management',
    component: RealEstateManagementComponent
  },
  {
    path: 'task-management',
    component: TaskOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
