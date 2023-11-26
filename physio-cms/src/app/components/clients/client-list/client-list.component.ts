import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'physio-cms-client-list',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent {

  constructor() {
  }


}
