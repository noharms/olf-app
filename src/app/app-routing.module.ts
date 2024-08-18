import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab } from 'src/model/tabs';
import { AboutComponent } from './about/about.component';
import { ArenaComponent } from './arena/arena.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CurrentGameComponent } from './arena/current-game/current-game.component';


export const TOP_LEVEL_DOMAIN_NAME: string = 'olf';
export const HOME_PATH: string = TOP_LEVEL_DOMAIN_NAME + "/home";
export const ABOUT_PATH: string = TOP_LEVEL_DOMAIN_NAME + "/about";
export const LOGIN_PATH: string = TOP_LEVEL_DOMAIN_NAME + "/login";
export const DASHBOARD_PATH: string = TOP_LEVEL_DOMAIN_NAME + "/personal/dashboard";
export const ARENA_PATH: string = TOP_LEVEL_DOMAIN_NAME + "/arena";
export const GAME_ID_URL_PARAMETER_NAME: string = 'gameId';

export const tabToRoute: Map<Tab, string> = new Map<Tab, string>(
  [
    [Tab.HOME, HOME_PATH],
    [Tab.PERSONAL, DASHBOARD_PATH],
    [Tab.ARENA, ARENA_PATH],
    [Tab.ABOUT, ABOUT_PATH],
  ]
);

const routes: Routes = [
  { path: HOME_PATH, component: HomeComponent },
  { path: ABOUT_PATH, component: AboutComponent },
  { path: LOGIN_PATH, component: LoginComponent },
  { path: DASHBOARD_PATH, component: DashboardComponent, canActivate: [authGuard] },
  { path: `${ARENA_PATH}/:${GAME_ID_URL_PARAMETER_NAME}`, component: CurrentGameComponent, canActivate: [authGuard] },
  { path: ARENA_PATH, component: ArenaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: HOME_PATH } // caveat: this needs to be at the end, because order matters in finding a matching route here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
