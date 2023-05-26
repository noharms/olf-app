import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userName: string = 'John Doe';
  userEmail: string = 'johndoe@example.com';
  registrationDate: Date = new Date();
  totalGamesPlayed: number = 10;
  numberOfWins: number = 7;
  numberOfLosses: number = 3;

  constructor(private router: Router) {}

  startNewGame() {
    this.router.navigate(['olf/cardgame']);
  }
}