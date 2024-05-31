import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentGameComponent } from './current-game/current-game.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


export const TOP_LEVEL_DOMAIN_NAME: string = 'olf';
export const HOME_PATH: string = TOP_LEVEL_DOMAIN_NAME + "/home";
export const DASHBOARD_PATH: string = `${TOP_LEVEL_DOMAIN_NAME}/personal/dashboard`;
export const CURRENT_GAME_PATH = `${TOP_LEVEL_DOMAIN_NAME}/cardgame`;
export const GAME_ID_URL_PARAMETER_NAME = 'gameId';

const routes: Routes = [
  { path: TOP_LEVEL_DOMAIN_NAME, component: LoginComponent },
  { path: HOME_PATH, component: HomeComponent },
  { path: DASHBOARD_PATH, component: DashboardComponent, canActivate: [authGuard] },
  { path: CURRENT_GAME_PATH + `/:${GAME_ID_URL_PARAMETER_NAME}`, component: CurrentGameComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: TOP_LEVEL_DOMAIN_NAME } // caveat: this needs to be at the end, because order matters in finding a matching route here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
