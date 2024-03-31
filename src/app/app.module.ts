import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './current-game/card/card.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { GameOverModalComponent } from './current-game/game-over-modal/game-over-modal.component';
import { HomeComponent } from './home/home.component';
import { CardCombinationComponent } from './current-game/card-combination/card-combination.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockHttpInterceptor } from 'src/mocks/mock-http-interceptor';
import { InviteFormComponent } from './home/invite-form/invite-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CurrentGameComponent,
    CardComponent,
    GameOverModalComponent,
    HomeComponent,
    CardCombinationComponent,
    InviteFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
