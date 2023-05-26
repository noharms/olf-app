import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentGameComponent } from './current-game/current-game.component';

const routes: Routes = [
  { path: 'olf/cardgame', component: CurrentGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
