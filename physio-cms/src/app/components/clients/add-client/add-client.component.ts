import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { ClientService } from "../../../services/client/client.service";

// interface clientForm {
//   firstName: string;
//   lastName: string;
//   age: string;
//   gender: {
//     gendermale: string;
//     genderfemale: string;
//   };
//   condition: string;
//   status: string;
//   weight: string;
// }
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
              private client: ClientService) {

    this.clientForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      age: ["", Validators.required],
      gender: ["", Validators.required],
      condition: ["", Validators.required],
      status: ["", Validators.required],
      weight: ["", Validators.required],
      // weight: ['', Validators.required]
    })


  }

  onSubmit() {
    console.log("Form submitted", this.clientForm.value);
    this.client.addClient(this.clientForm.value).subscribe(
      response => {
        console.log('Client added successfully:', response);
        // Handle success, e.g., show a success message or navigate to another page
      },
      error => {
        console.error('Error adding client:', error);
        // Handle error, e.g., show an error message to the user
      }

    )
  }


}
