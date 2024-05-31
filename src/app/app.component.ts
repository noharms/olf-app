import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENT_GAME_PATH, DASHBOARD_PATH, TOP_LEVEL_DOMAIN_NAME } from './app-routing.module';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  title: string = 'Olf App';
  currentPath: string = DASHBOARD_PATH;

  readonly TAB_PATHS: string[] = [
    DASHBOARD_PATH,
    CURRENT_GAME_PATH + "/1",
    DASHBOARD_PATH,
    CURRENT_GAME_PATH + "/2",
  ];

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

  selectTab(newPath: string) {
    this.currentPath = newPath;
    this.router.navigate([this.currentPath]);
  }
}
