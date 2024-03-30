import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentGameComponent, GAME_ID_URL_PARAMETER_NAME } from './current-game/current-game.component';
import { HomeComponent } from './home/home.component';

export const CURRENT_GAME_BASE_PATH = 'olf/cardgame';

const routes: Routes = [
  { path: 'olf/home', component: HomeComponent },
  { path: `${CURRENT_GAME_BASE_PATH}/:${GAME_ID_URL_PARAMETER_NAME}`, component: CurrentGameComponent },
  { path: '**', component: HomeComponent } // caveat: this needs to be at the end, because order matters in finding a matching route here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
