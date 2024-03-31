import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'physio-cms-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(private router: Router) { }

  searchClients() {
    // Implement navigation to the search page
    this.router.navigate(['/search-clients']);
  }

  addAppointment() {
    // Implement navigation to the add appointment page
    this.router.navigate(['/add-appointment']);
  }

  viewAppointments() {
    // Implement navigation to the view appointments page
    this.router.navigate(['/view-appointments']);
  }

  viewCalendar() {
    // Implement navigation to the view appointments page
    this.router.navigate(['/calendar']);
  }
}
