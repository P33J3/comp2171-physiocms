import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { AppointmentService } from '../../services/appointment/appointment.service';
import { GoogleApis, google, Auth } from 'googleapis';
import * as environment  from '../../../../environment.app';



@Component({
  selector: 'physio-cms-add-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css',
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private client: AppointmentService,
    private router: Router
              ) {

    this.appointmentForm = this.fb.group({
      dateTime: ["", Validators.required],
      clientId: [""],
      name: [""],
      additionalMessage: ["", Validators.required]
    })


  }



  cancel() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    this.client.addAppointment(this.appointmentForm.value).subscribe(
      response => {
        this.router.navigate(['/view-appointments']);
      }
    )
  }
}
