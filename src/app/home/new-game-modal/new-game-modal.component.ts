import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication.service';
import { GameService } from 'src/app/game.service';
import { UserService } from 'src/app/user.service';
import { Game } from 'src/model/game';
import { GameInvitation } from 'src/model/game-invitation/game-invitation';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { User } from 'src/model/user';
import { getOrIfBlank } from 'src/utils/string-utils';

@Component({
  selector: 'app-new-game-modal',
  templateUrl: './new-game-modal.component.html',
  styleUrls: ['./new-game-modal.component.scss']
})
export class NewGameModalComponent implements OnInit {

  private knownUsers: User[] = [];
  private readonly MINIMUM_PLAYERS_PER_GAME: number = 2;
  readonly FORM_FIELD_USERNAME: string = 'username'; // needs to match with the definition of the formGroup
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
  });
  autoCompleteOptions: Observable<string[]> = of([]);
  addedPlayersDataSource: MatTableDataSource<string> = new MatTableDataSource<string>([]);

  constructor(
    private dialogRef: MatDialogRef<NewGameModalComponent>,
    private authService: AuthenticationService,
    private userService: UserService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      users => {
        this.knownUsers = users;
        this.initializeAutoCompleteOptions();
      }
    );
  }

  private initializeAutoCompleteOptions(): void {
    const userNameControl: AbstractControl<any, any> = this.form.controls[this.FORM_FIELD_USERNAME];
    this.autoCompleteOptions = userNameControl.valueChanges.pipe(
      // This operator ensures that filteredOptions emits an initial value immediately upon subscription.
      // It helps populate autocomplete options even before the user starts typing.
      startWith(''),
      // If there is a value (i.e., the user has typed something): find matching options except current user
      // if nothing is typed, show all users except current user
      map(
        userInput => {
          const userNames: string[] = userInput ? this.findMatchingUsernames(userInput) : this.knownUsers.map(u => u.name);
          return userNames.filter(userName => userName !== this.authService.currentUser?.name.toLowerCase())
        }
      )
    )
  }

  private findMatchingUsernames(userInput: string): string[] {
    const input: string = userInput.toLowerCase();
    return this
      .knownUsers
      .map(u => u.name)
      .filter(userName => userName.toLowerCase().includes(input));
  }

  onOptionSelection(event: MatAutocompleteSelectedEvent): void {
    const value: string = event.option.value; // Accessing the value of the selected option
    if (value) {
      console.log(`The following autocomplete option was selected: ${value}`)
    }
  }

  addPlayerByUsername(): void {
    const username: string = this.form.value.username;
    if (this.isAdded(username)) {
      console.log(getOrIfBlank(`Username ${username} is already added`, 'Username is empty.'));
    } else if (!this.isUserKnown(username)) {
      console.log(getOrIfBlank(`Username ${username} does not exist`, 'Username is empty.'));
    } else {
      this.addedPlayersDataSource.data.push(username);
      // the following new array assignment is needed to trigger change detection and rerender the table
      this.addedPlayersDataSource.data = [...this.addedPlayersDataSource.data];
      this.form.controls[this.FORM_FIELD_USERNAME].reset();
    }
  }

  private isUserKnown(username: string): boolean {
    return this.knownUsers.map(u => u.name).includes(username);
  }

  private isAdded(username: string): boolean {
    return this.addedPlayersDataSource.data.includes(username);
  }

  submitGame(): void {
    const addedUsernames: string[] = this.addedPlayersDataSource.data;
    const playerCount: number = addedUsernames.length + 1; // +1 for game creator
    if (playerCount >= this.MINIMUM_PLAYERS_PER_GAME) {
      const creator: User | null = this.authService.currentUser;
      if (creator == null) {
        console.log('Unexpected behaviour: no user logged in. Cannot create a new game.');
      } else {
        const invitedPlayers: User[] = addedUsernames
          .map(username => this.knownUsers.find(u => u.name === username))
          .filter(user => user !== undefined) as User[];
        const invitationStatus: GameInvitationStatus = this.gameService.createInvitation(creator, invitedPlayers);

      }

      //   this.router.navigateByUrl(`${CURRENT_GAME_PATH}/${newGame.id}`);
      // } 
    } else {
      alert(`Cannot create a new game if less than ${this.MINIMUM_PLAYERS_PER_GAME} are selected.`);
    }
    // Logic to submit the game to your GameService API
    // Close the dialog and redirect
    this.dialogRef.close();
    // Redirect logic here
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
