import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { environment } from "../../../.environment.app";
import { User } from './user.model';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken, } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { from } from 'rxjs';
import firebase from "firebase/compat";
import initializeApp = firebase.initializeApp;

export const ANONYMOUS_USER: User = new User(
  '',
  '',
  '',
  new Date()
);

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(ANONYMOUS_USER);
  private tokenExpirationTimer: any;


  private auth = getAuth();

  constructor(
    private http: HttpClient,
    private router: Router,

  ) {}

  isLoggedIn(): boolean {

    // Implement logic to check if the user is logged in
    // console.log('isLoggedIn', !!this.user.value.token);
    return !!this.user.value.token; // Assuming your user object has a "token" property
  }


  async signup(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        catchError(this.handleError),
        tap(async (userCredential) => {
          const user = userCredential.user;
          if (user) {
            const idTokenResult = await user?.getIdTokenResult();
            const expiresIn = idTokenResult?.expirationTime;
            this.handleAuthentication(user.email, user.uid ?? '', idTokenResult?.token ?? '', expiresIn);
          }
        })
      );
  }


  async login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        catchError(this.handleError),
        tap(async (userCredential) => {
          const user = userCredential.user;
          if (user) {
            const idTokenResult = await user?.getIdTokenResult();
            if (idTokenResult && idTokenResult.expirationTime) {
              const expiresIn = idTokenResult.expirationTime;
              this.handleAuthentication(user.email, user.uid ?? '', idTokenResult.token ?? '', expiresIn);
            } else {
              // Handle the case where idTokenResult or expirationTime is null
              console.error('Invalid idTokenResult or expirationTime');
            }
          } else {
            // Handle the case where user is null after signing in
            console.error('User is null after signing in');
          }
        })
      );
  }
  autoLogin() {
    const userDataJSON = localStorage.getItem('physioCMSuserData');
    if (!userDataJSON) {
      return;
    }

    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(userDataJSON);
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);

      console.log('Navigating to /home');
      this.router.navigate(['/home']);
    }
  }

  logout() {
    this.user.next(ANONYMOUS_USER);
    this.router.navigate(['/auth']).then(r => r);
    localStorage.removeItem('physioCMSuserData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }



  private handleAuthentication(
    email: string | null,
    userId: string,
    token: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(expiresIn);
    const user = new User(email, userId, token, expirationDate);
    console.log('user', user);
    this.user.next(user);
    const expirationDuration = expirationDate.getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
    localStorage.setItem('physioCMSuserData', JSON.stringify(user));
    this.router.navigate(['/home']);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorRes.error.error.message);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
