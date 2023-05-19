import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-game',
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.scss']
})
export class CardGameComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {    
  }

  startNewGame() {
    this.router.navigate(['/olf/cardgame/current']);
  }
}
