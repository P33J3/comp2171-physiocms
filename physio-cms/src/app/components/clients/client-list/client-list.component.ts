import { Component, OnInit, Output } from "@angular/core";
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
  @Output() id: any;
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
    this.router.navigate([`/viewclient/${id}`])
  }

  addClientView() {
    this.router.navigate([`/addclient`])
  }

  applyFilter() {
    if (!this.clientData) {
      return;
    }

    // Convert search text to lowercase for case-insensitive search
    const searchTermFirst = this.searchFirstName.toLowerCase();
    const searchTermLast = this.searchLastName.toLowerCase();

    // Filter clientData based on both first name and last name containing the search terms
    this.clientData = this.clientData.filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTermFirst) &&
        client.lastName.toLowerCase().includes(searchTermLast)
    );
  }

  clearFilter() {
    // Reset clientData to the original list when the search is cleared
    this.client.allClients().subscribe((clients) => {
      this.clientData = clients;
    });

    // Clear the search input fields
    this.searchFirstName = '';
    this.searchLastName = '';
  }
}
