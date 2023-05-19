import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardGameComponent } from './card-game/card-game.component';
import { CurrentGameComponent } from './card-game/current-game/current-game.component';

const routes: Routes = [
  { path: 'olf/cardgame', component: CardGameComponent },
  { path: 'olf/cardgame/current', component: CurrentGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
