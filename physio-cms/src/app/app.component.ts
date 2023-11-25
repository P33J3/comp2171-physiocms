import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import {ClientListComponent} from "./components/clients/client-list/client-list.component";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, ClientListComponent],
  selector: 'physio-cms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'physio-cms';
}
