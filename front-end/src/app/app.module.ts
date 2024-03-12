import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/user-login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {ToastrModule} from "ngx-toastr";
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";
import {EmailValidatorDirective} from "./validators/email-validator.directive";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import { MainNavComponent } from './components/main-nav/main-nav.component';
import {MatActionList, MatListModule} from '@angular/material/list';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { RealEstateManagementComponent } from './components/real-estate-management/real-estate-management.component';
import { TaskOverviewComponent } from './components/task-overview/task-overview.component';
import {MatHeaderCell, MatRow, MatTableModule} from "@angular/material/table";
import { RealEstateCreateComponent } from './components/real-estate-create/real-estate-create.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RealEstateDetailComponent } from './components/real-estate-detail/real-estate-detail.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { ChecklistTemplatesComponent } from './components/checklist-templates/checklist-templates.component';
import {AuthInterceptorService} from "./services/interceptor/auth-interceptor.service";
import { LastWarningComponent } from './components/last-warning/last-warning.component';
import {MatTooltip} from "@angular/material/tooltip";
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {provideNativeDateAdapter} from "@angular/material/core";
import {CommonModule} from "@angular/common";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatTabHeader} from "@angular/material/tabs";
import {MatBadge} from "@angular/material/badge";
import { FullSizeImageDialogComponent } from './components/full-size-image-dialog/full-size-image-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserCreateComponent,
    EmailValidatorDirective,
    MainNavComponent,
    UserManagementComponent,
    RealEstateManagementComponent,
    TaskOverviewComponent,
    RealEstateCreateComponent,
    TaskCreateComponent,
    DashboardComponent,
    RealEstateDetailComponent,
    TaskDetailComponent,
    UserDetailComponent,
    ChecklistTemplatesComponent,
    LastWarningComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    FullSizeImageDialogComponent
  ],
    imports: [
        NgxMaterialTimepickerModule,
        CommonModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatDividerModule,
        MatSelect,
        MatSortModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({positionClass: 'toast-bottom-center'}),
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        MatOption,
        MatSidenavModule,
        MatToolbar,
        MatToolbarModule,
        MatExpansionModule,
        MatTooltip,
        MatListModule,
        MatHeaderCell,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatTableModule,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatProgressSpinner,
        MatCheckbox,
        MatTabHeader,
        MatBadge
    ],
  providers: [
    provideNativeDateAdapter(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
