import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockHttpInterceptor } from 'src/mocks/mock-http-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardCombinationComponent } from './current-game/card-combination/card-combination.component';
import { CardComponent } from './current-game/card/card.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { GameOverModalComponent } from './current-game/game-over-modal/game-over-modal.component';
import { HomeComponent } from './home/home.component';
import { NewGameModalComponent } from './home/new-game-modal/new-game-modal.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { UserTableComponent } from './home/user-table/user-table.component';
import { UpcomingGamesTableComponent } from './home/upcoming-games-table/upcoming-games-table.component';
import { FinishedGamesTableComponent } from './home/finished-games-table/finished-games-table.component';
import { OpenGamesTableComponent } from './home/open-games-table/open-games-table.component';
import { SignUpModalComponent } from './landing-page/sign-up-modal/sign-up-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrentGameComponent,
    CardComponent,
    GameOverModalComponent,
    HomeComponent,
    CardCombinationComponent,
    LandingPageComponent,
    NewGameModalComponent,
    UserTableComponent,
    UpcomingGamesTableComponent,
    FinishedGamesTableComponent,
    OpenGamesTableComponent,
    SignUpModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatAutocompleteModule,
    MatIconModule
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
