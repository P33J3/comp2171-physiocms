import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ClientService } from "../../../services/client/client.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'physio-cms-edit-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css',
})
export class EditClientComponent implements OnInit{
  clientForm: FormGroup;
  id: string = "";


  constructor(
    private fb: FormBuilder,
    private client: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      condition: ['', Validators.required],
      status: ['', Validators.required],
      weight: ['', Validators.required],
      report: ["", Validators.required],
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
          report: this.clientData.report
        });
      }
    );
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    const formValues = this.clientForm.value;
    const lowerCaseFormValues = {
      firstName: formValues.firstName.toLowerCase(),
      lastName: formValues.lastName.toLowerCase(),
      age: formValues.age,
      gender: formValues.gender,
      condition: formValues.condition,
      status: formValues.status,
      weight: formValues.weight,
      report: formValues.report,
    }
    this.client.updateClient(this.id, lowerCaseFormValues).subscribe(
      response => {
        this.router.navigate(['/home']);

      }
    )
    // this.clientForm.reset();
  }
}
