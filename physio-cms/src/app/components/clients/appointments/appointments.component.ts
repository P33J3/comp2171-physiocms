import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isIdentifier } from '@angular/compiler';

@Component({
  selector: 'physio-cms-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent {
  totalAppointments: number = 0;
  attendedAppointments: number = 0;

  get progress(): number {
    return (this.attendedAppointments / this.totalAppointments) * 100;
  }
}


