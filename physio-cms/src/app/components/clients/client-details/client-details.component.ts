import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ClientService } from "../../../services/client/client.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'physio-cms-client-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent implements OnInit{
  @Input() id: any = "R0nnQALIthEXaiZ6W0UQ";

  constructor(
    private client: ClientService,
    private route: ActivatedRoute,
    private router: Router
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

  editClient(){
    this.router.navigate(([`/getclient/${this.id}`]))
  }

  deleteClient() {
    this.client.deleteClient(this.id).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        //Handle error
      }
    )
  }
}
