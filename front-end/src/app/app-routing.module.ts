import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/user-login/login.component";
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {UserManagementComponent} from "./components/user-management/user-management.component";
import {RealEstateManagementComponent} from "./components/real-estate-management/real-estate-management.component";
import {TaskOverviewComponent} from "./components/task-overview/task-overview.component";
import {authGuardGuard} from "./guard/auth-guard.guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {RealEstateCreateComponent} from "./components/real-estate-create/real-estate-create.component";
import {RealEstateDetailComponent} from "./components/real-estate-detail/real-estate-detail.component";
import {TaskDetailComponent} from "./components/task-detail/task-detail.component";
import {TaskCreateComponent} from "./components/task-create/task-create.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'user-profile',
    component:UserProfileComponent,
    canMatch:[authGuardGuard]
  },
  {
    path: 'admin/user-management',
    component: UserManagementComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'admin/real-estate-detail/:id',
    component: RealEstateDetailComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'admin/real-estate-management',
    component: RealEstateManagementComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'admin/real-estate-create',
    component: RealEstateCreateComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'admin/create-task',
    component: TaskCreateComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'task-overview',
    component: TaskOverviewComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'task-detail/:id',
    component: TaskDetailComponent,
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
