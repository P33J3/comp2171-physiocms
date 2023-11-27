import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClientService } from "../../../services/client/client.service";
import { map, shareReplay, tap } from "rxjs";
import { ActivatedRoute} from "@angular/router";

@Component({
  selector: 'physio-cms-edit-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css',
})
export class EditClientComponent implements OnInit{
  clientForm: FormGroup;

  @Input() id: any = "j3tYz2Ddf9JP32uoHxTB";


  constructor(
    private fb: FormBuilder,
    private client: ClientService,
    private route: ActivatedRoute
  ) {

    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      condition: ['', Validators.required],
      status: ['', Validators.required],
      weight: ['', Validators.required],
      // weight: ['', Validators.required]
    });
  }

  clientData: any = {};
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.client.viewClient(this.id).subscribe(
      client => {
        this.clientData = client;

        this.clientForm.patchValue({
          firstName: this.clientData.firstName,
          lastName: this.clientData.lastName,
          age: this.clientData.age,
          gender: this.clientData.gender,
          condition: this.clientData.condition,
          status: this.clientData.status,
          weight: this.clientData.weight,
        });

        console.log('clientForm', this.clientForm.value);
        console.log('clientData', this.clientData);
      },
      error => {
        console.error('Error fetching client data:', error);
      }
    );
  }

  onSubmit() {
    // Handle form submission logic here
  }
}
