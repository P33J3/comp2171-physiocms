import {Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { AppointmentService } from '../services/appointment/appointment.service';
import { GoogleApis, google, Auth } from 'googleapis';
import * as environment  from '../../../environment.app';

@Component({
  selector: 'physio-cms-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-appointments.component.html',
  styleUrl: './view-appointments.component.css',
})
export class ViewAppointmentsComponent implements OnInit {
  id: string = '';
  constructor(
    private client: AppointmentService,
    private router: Router
  ) {}

  appointments: any[] | undefined;
  searchFirstName: string = '';
  searchLastName: string = '';

  ngOnInit() {

    this.client.getAllAppointments().subscribe(
      (appointment) => {
        this.appointments = appointment;
    });
  }

  viewAppoitment(id: any) {
    this.router.navigate([`/view-appointment/${id}`])
  }

}
