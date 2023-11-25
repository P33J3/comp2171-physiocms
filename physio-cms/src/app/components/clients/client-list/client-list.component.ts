import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientService} from "../../../services/client/client.service";

@Component({
  selector: 'physio-cms-client-list',
  standalone: true,
  imports: [
      CommonModule
  ],
  providers: [
      ClientService
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent {

  constructor(private clientService: ClientService) {
  }

  clientData = this.clientService.clientData;

}
