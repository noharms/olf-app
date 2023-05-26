import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentGameComponent } from './current-game/current-game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'olf/home', component: HomeComponent },
  { path: 'olf/cardgame', component: CurrentGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
