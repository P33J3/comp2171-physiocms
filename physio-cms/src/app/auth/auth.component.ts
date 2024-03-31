import { Component } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from, switchMap } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'physio-cms-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: null = null;
  authForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    const email = this.authForm.controls['email'].value
    const password = this.authForm.controls['password'].value
    let authObs;

    this.isLoading = true;

    authObs = from(this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signup(email, password))
      .pipe(switchMap(innerObs => innerObs));

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );



    this.authForm.reset();
  }


}
