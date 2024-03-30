import { Component } from '@angular/core';
import { AuthService } from "./auth/auth.service";
@Component({
  selector: 'physio-cms-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private authService: AuthService,

  ) {}

  ngOnInit() {
    this.authService.autoLogin();

  }
  title = 'physio-cms';
}
