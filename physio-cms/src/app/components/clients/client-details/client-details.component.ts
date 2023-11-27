import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ClientService } from "../../../services/client/client.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'physio-cms-client-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent implements OnInit{
  @Input() id: any = "j3tYz2Ddf9JP32uoHxTB";

  constructor(
    private client: ClientService,
    private route: ActivatedRoute
  ) {}

  clientData: any = {};

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.client.viewClient(this.id).subscribe(
      client => {
        this.clientData = client;
        console.log('clientData', this.clientData);
      });
  }
}
