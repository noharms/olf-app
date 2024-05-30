import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HOME_PATH } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { SignUpModalComponent } from './sign-up-modal/sign-up-modal.component';
import { User } from 'src/model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private signUpDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.redirectIfUserLoggedIn();
  }

  private redirectIfUserLoggedIn() {
    const currentUser: User | null = this.authService.currentUser;
    if (currentUser) {
      this.redirectToHome(currentUser);
    }
  }

  private redirectToHome(currentUser: User) {
    console.log(`Logged in user found: ${currentUser.name}. Redirecting from login to home`);
    this.router.navigate([HOME_PATH]);
  }

  onLogin(): void {
    this.authService.login(this.username, this.password);
    const currentUser: User | null = this.authService.currentUser;
    if (currentUser) {
      this.redirectToHome(currentUser);
    } else {
      console.warn(`Error: login credentials for user (${this.username}) unknown. Login failed.`);
    }
  }

  onSignUp() {
    this.signUpDialog.open(
      SignUpModalComponent,
      {
        disableClose: true // Disables closing by clicking outside of the dialog
      });
  }
}
