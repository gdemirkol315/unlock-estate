import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {CreateUserComponent} from "./components/create-user/create-user.component";
import {ToastrModule} from "ngx-toastr";
import {HttpClientModule} from "@angular/common/http";
import {EmailValidatorDirective} from "./validators/email-validator.directive";
import {MatOption, MatSelect} from "@angular/material/select";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    EmailValidatorDirective
  ],
  imports: [
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
    BrowserAnimationsModule,
    ToastrModule.forRoot({positionClass: 'toast-bottom-center'}),
    ReactiveFormsModule,
    MatOption,

  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
