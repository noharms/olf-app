import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DASHBOARD_PATH } from '../app-routing.module';
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
      this.redirectToDashboard(currentUser);
    }
  }

  private redirectToDashboard(currentUser: User) {
    console.log(`Logged in user found: ${currentUser.name}. Redirecting from login to dashboard`);
    this.router.navigate([DASHBOARD_PATH]);
  }

  onLogin(): void {
    this.authService.login(this.username, this.password);
    const currentUser: User | null = this.authService.currentUser;
    if (currentUser) {
      this.redirectToDashboard(currentUser);
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
