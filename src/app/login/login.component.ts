import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HOME_PATH } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';
import { SignUpModalComponent } from './sign-up-modal/sign-up-modal.component';

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

  onLogin(): void {
    this.authService.login(this.username, this.password);
    if (this.authService.currentUser) {
      this.router.navigate([HOME_PATH]);
    } else {
      console.warn(`Error: login credentials for user (${this.username}) unknown. Login failed.`)
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
