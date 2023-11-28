import { Component, OnInit, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ClientService } from "../../../services/client/client.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Client } from "../../../models/client.model";

@Component({
  selector: 'physio-cms-client-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent implements OnInit{
  @Output() id: any;
  constructor(
    private client: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  clientData: Client[] | undefined;

  ngOnInit() {
    // this.id = this.route.snapshot.params['id'];

    this.client.allClients().subscribe(
      (client) => {
        this.clientData = client;
        // console.log('clientData', this.clientData);
    });
  }

  viewClient(id: any) {
    this.router.navigate([`/viewclient/${id}`])
  }
}
