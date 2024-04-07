import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-game-modal',
  templateUrl: './new-game-modal.component.html',
  styleUrls: ['./new-game-modal.component.scss']
})
export class NewGameModalComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
  });
  userNameOptions: string[] = ['exampleUser1', 'exampleUser2']; // Placeholder for registered usernames
  filteredOptions: Observable<string[]> = of([]);
  dataSource: MatTableDataSource<string> = new MatTableDataSource<string>(['player1', 'player2', 'player3']);;

  constructor(private dialogRef: MatDialogRef<NewGameModalComponent>) { }

  ngOnInit() {
    const userNameControl: AbstractControl<any, any> = this.form.controls['username'];
    this.filteredOptions = userNameControl.valueChanges.pipe(
      // This operator ensures that filteredOptions emits an initial value immediately upon subscription.
      // It helps populate autocomplete options even before the user starts typing.
      startWith(''),
      // If there is a value (i.e., the user has typed something): find matching options, otherwise no options
      map(userInput => userInput ? this.findMatchingOptions(userInput) : []),
    );
  }

  private findMatchingOptions(userInput: string): string[] {
    const input: string = userInput.toLowerCase();
    return this.userNameOptions.filter(userName => userName.toLowerCase().includes(input));
  }


  addPlayer(event: MatAutocompleteSelectedEvent): void {
    const value: string = event.option.value; // Accessing the value of the selected option
    if (value) {
      // TODO this method is called on selecting an option! instead it should be called on clicking the add button!
      // this.dataSource.data.push(value);
      // this.dataSource.data = [...this.dataSource.data]; // Refresh the MatTableDataSource to update the table
      //this.form.controls['username'].reset();
    }
  }

  addPlayerByUsername(): void {
    const username: string = this.form.value.username;
    if (!this.dataSource.data.includes(username)) {
      this.dataSource.data.push(username);
      this.dataSource.data = [...this.dataSource.data]; // Refresh the MatTableDataSource to update the table
      this.form.controls['username'].reset();
    } else {
      // Optionally, alert the user that the username doesn't exist
      console.log('Username does not exist or is already added');
    }
  }

  submitGame(): void {
    // if (this.playersForNewGame.length >= this.MINIMUM_PLAYERS_PER_GAME) {
    //   const newGame: Game = this.gameService.createNewGame(this.playersForNewGame);
    //   this.router.navigateByUrl(`${CURRENT_GAME_PATH}/${newGame.id}`);
    // } else {
    //   alert(`Cannot create a new game if less than ${this.MINIMUM_PLAYERS_PER_GAME} are selected.`);
    // }
    // Logic to submit the game to your GameService API
    // Close the dialog and redirect
    this.dialogRef.close();
    // Redirect logic here
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
