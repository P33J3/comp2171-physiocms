import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ClientService } from "../../../services/client/client.service";
import { Router } from "@angular/router";
import { Client } from "../../../models/client.model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'physio-cms-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent implements OnInit{
  id: string = '';
  constructor(
    private client: ClientService,
    private router: Router
  ) {}

  clientData: Client[] | undefined;
  searchFirstName: string = '';
  searchLastName: string = '';

  ngOnInit() {

    this.client.allClients().subscribe(
      (client) => {
        this.clientData = client;
    });
  }

  viewClient(id: any) {
    this.router.navigate([`/view-client/${id}`])
  }

  addClientView() {
    this.router.navigate([`/add-client`])
  }

  applyFilter() {

    const searchTermFirst = this.searchFirstName.toLowerCase();
    const searchTermLast = this.searchLastName.toLowerCase();

    this.clientData = this.clientData?.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTermFirst) &&
        client.lastName.toLowerCase().includes(searchTermLast)
    );
  }

  clearFilter() {

    this.client.allClients().subscribe((clients) => {
      this.clientData = clients;
    });

    this.searchFirstName = '';
    this.searchLastName = '';
  }
}
