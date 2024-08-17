import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockHttpInterceptor } from 'src/mocks/mock-http-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardCombinationComponent } from './current-game/card-combination/card-combination.component';
import { CardComponent } from './current-game/card/card.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { GameOverModalComponent } from './current-game/game-over-modal/game-over-modal.component';
import { FinishedGamesTableComponent } from './dashboard/finished-games-table/finished-games-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewGameModalComponent } from './dashboard/new-game-modal/new-game-modal.component';
import { OpenGamesTableComponent } from './dashboard/open-games-table/open-games-table.component';
import { UpcomingGamesTableComponent } from './dashboard/upcoming-games-table/upcoming-games-table.component';
import { UserTableComponent } from './dashboard/user-table/user-table.component';
import { LoginComponent } from './login/login.component';
import { SignUpModalComponent } from './login/sign-up-modal/sign-up-modal.component';
import { HomeComponent } from './home/home.component';
import { PlayerMoveComponent } from './current-game/player-move/player-move.component';
import { AboutComponent } from './about/about.component';

@NgModule({ declarations: [
        AppComponent,
        CurrentGameComponent,
        CardComponent,
        GameOverModalComponent,
        DashboardComponent,
        CardCombinationComponent,
        LoginComponent,
        NewGameModalComponent,
        UserTableComponent,
        UpcomingGamesTableComponent,
        FinishedGamesTableComponent,
        OpenGamesTableComponent,
        SignUpModalComponent,
        HomeComponent,
        AboutComponent,
        PlayerMoveComponent
    ],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockHttpInterceptor,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
