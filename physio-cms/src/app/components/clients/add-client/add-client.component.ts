import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { ClientService } from "../../../services/client/client.service";
import { Router } from "@angular/router";


@Component({
  selector: 'physio-cms-add-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css',
})
export class AddClientComponent {
  clientForm: FormGroup;

  constructor(private fb: FormBuilder,
              private client: ClientService,
              private router: Router
  ) {

    this.clientForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      age: ["", Validators.required],
      gender: ["", Validators.required],
      condition: ["", Validators.required],
      status: ["", Validators.required],
      weight: ["", Validators.required],
      report: ["", Validators.required],
    })
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    // console.log("Form submitted", this.clientForm.value);\
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
    this.client.addClient(lowerCaseFormValues).subscribe(
      response => {
        this.router.navigate(['/home']);
      }
    )
  }


}
