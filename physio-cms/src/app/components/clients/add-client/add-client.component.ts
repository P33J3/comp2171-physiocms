import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

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

  constructor(private fb: FormBuilder) {
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
  }


}
