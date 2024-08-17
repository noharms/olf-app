import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENT_GAME_PATH, DASHBOARD_PATH, HOME_PATH, LOGIN_PATH, TOP_LEVEL_DOMAIN_NAME } from './app-routing.module';
import { AuthenticationService } from './authentication.service';
import { TabService } from './tab.service';
import { Tab } from 'src/model/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  title: string = 'Olf App';
  tabsEnum: typeof Tab = Tab;
  selectedTab: Tab = Tab.HOME;

  constructor(
    private authService: AuthenticationService,
    private tabService: TabService,
    private router: Router
  ) { }

  ngOnInit() {
    this.tabService.tab$.subscribe(
      newTab => this.selectedTab = newTab
    );
  }

  redirectToLogin() {
    // note: this happens without changing the selected tab
    this.router.navigate([LOGIN_PATH]);
  }

  logout() {
    this.authService.logout();
    this.tabService.selectTabAndRedirect(Tab.HOME);
  }

  isUserLoggedIn(): boolean {
    return this.authService.currentUser !== null;
  }

  loggedInUsername(): string {
    return this.authService.currentUser?.name ?? "error: no user logged in";
  }

  selectTab(tab: Tab) {
    this.tabService.selectTabAndRedirect(tab)
  }
}
