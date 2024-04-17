import { Component } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { Observable } from "rxjs";

@Component({
  selector: 'physio-cms-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isUserSignedIn: boolean = false;

  constructor(
    private authService: AuthService,

  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isUserSignedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout();
  }
}
