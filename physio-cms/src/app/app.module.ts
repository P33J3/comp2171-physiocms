import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ClientService } from './services/client/client.service';
import { AddClientComponent } from "./components/clients/add-client/add-client.component";
import { ClientListComponent } from "./components/clients/client-list/client-list.component";
import { EditClientComponent } from "./components/clients/edit-client/edit-client.component";

@NgModule({
  declarations: [
    AppComponent,
    // Other components
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule, // Add HttpClientModule to the imports array
    AddClientComponent,
<<<<<<< Updated upstream
    ClientListComponent,
    EditClientComponent
  ],
=======
    EditClientComponent,
    ClientListComponent,
    //MatToolbarModule,
    //MatIconModule
    ],
>>>>>>> Stashed changes
  providers: [
    ClientService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
