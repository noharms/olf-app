import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENT_GAME_PATH, HOME_PATH, TOP_LEVEL_DOMAIN_NAME } from './app-routing.module';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Olf App';
  currentPath: string = TOP_LEVEL_DOMAIN_NAME;

  readonly TAB_PATHS: string[] = [
    HOME_PATH,
    CURRENT_GAME_PATH + "/1",
    HOME_PATH,
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

  onTabChange(event: any) {
    console.log(`Switching to tab ${event.index}`);
    this.currentPath = this.TAB_PATHS[event.index];
    this.router.navigate([this.currentPath]);
  }
}
