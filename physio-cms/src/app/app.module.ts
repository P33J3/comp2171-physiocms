import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from './services/client/client.service';
import { AddClientComponent } from "./components/clients/add-client/add-client.component";
import { EditClientComponent } from "./components/clients/edit-client/edit-client.component";
import { ClientListComponent } from "./components/clients/client-list/client-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from './auth/auth.component';
import { initializeApp } from 'firebase/app';
import { environment } from "../../.environment.app";
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from "@fullcalendar/angular";

@NgModule({
  declarations: [AppComponent, AuthComponent, CalendarComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    AddClientComponent,
    EditClientComponent,
    ClientListComponent,
    ReactiveFormsModule,
    FullCalendarModule,
  ],
  providers: [ClientService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    initializeApp(environment.firebaseConfig);
  }
}
