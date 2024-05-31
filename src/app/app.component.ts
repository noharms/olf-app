import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TOP_LEVEL_DOMAIN_NAME } from './app-routing.module';
import { AuthenticationService } from './authentication.service';
import { MOCK_USERS } from 'src/mocks/mock-user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'olf-app';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate([TOP_LEVEL_DOMAIN_NAME]);
  }

  isUserLoggedIn(): boolean {
    return this.authService.currentUser !== null;
  }
}
