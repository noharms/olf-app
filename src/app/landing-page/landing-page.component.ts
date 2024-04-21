import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HOME_PATH } from '../app-routing.module';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  onLogin(): void {
    this.authService.login(this.username, this.password);
    if (this.authService.currentUser) {
      this.router.navigate([HOME_PATH]);
    } else {
      console.warn(`Error: login credentials for user (${this.username}) unknown. Login failed.`)
    }
  }
}
