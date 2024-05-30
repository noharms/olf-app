import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication.service';
import { GameService } from 'src/app/game.service';
import { UserService } from 'src/app/user.service';
import { GameInvitationStatus } from 'src/model/game-invitation/game-invitation-status';
import { User } from 'src/model/user';
import { getOrIfBlank } from 'src/utils/string-utils';

@Component({
  selector: 'app-new-game-modal',
  templateUrl: './new-game-modal.component.html',
  styleUrls: ['./new-game-modal.component.scss']
})
export class NewGameModalComponent implements OnInit {

  private readonly MINIMUM_PLAYERS_PER_GAME: number = 2;
  readonly PLACEHOLDER_ROW: string = 'None';
  readonly FORM_FIELD_USERNAME: string = 'username'; // needs to match with the definition of the formGroup

  private knownUsers: User[] = [];
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
  });
  autoCompleteOptions: Observable<string[]> = of([]);
  addedPlayersDataSource: MatTableDataSource<string> = new MatTableDataSource<string>([]);
  isAddPlayersDisabled: boolean = true;
  isSubmitDisabled: boolean = true;
  tableColumnHeaders: string[] = ['COL_PLAYERS', 'COL_REMOVE']

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
        this.addedPlayersDataSource.data = [this.PLACEHOLDER_ROW];

        this.form.get(this.FORM_FIELD_USERNAME)?.valueChanges.subscribe(value => {
          this.isAddPlayersDisabled = !users.map(u => u.name).includes(value);
        });
      }
    );
  }

  private initializeAutoCompleteOptions(): void {
    const userNameControl: AbstractControl<any, any> = this.form.controls[this.FORM_FIELD_USERNAME];
    this.autoCompleteOptions = userNameControl.valueChanges.pipe(
      // Note: The startWith operator ensures that filteredOptions emits an initial value immediately upon
      // subscription. It populates autocomplete options even before the user starts typing
      // --> in our case, however, we do not want to see the autocomplete options because they hide buttons
      // startWith(''),

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

  removePlayer(dataSourceElement: string, dataSourceIndex: number) {
    console.log(`Remove ${dataSourceElement}`)
    const updatedData: string[] = this.addedPlayersDataSource.data.slice();
    updatedData.splice(dataSourceIndex, 1);
    if (updatedData.length == 0) {
      updatedData.push(this.PLACEHOLDER_ROW);
      this.isSubmitDisabled = true;
    }
    this.addedPlayersDataSource.data = updatedData;
  }

  addComputer() {
    console.log("Add computer");
    this.addValidUserToPlayersTable('computer');
  }

  addPlayerByUsername(): void {
    const username: string = this.form.value.username;
    if (this.isAdded(username)) {
      console.log(getOrIfBlank(`Username ${username} is already added`, 'Username is empty.'));
    } else if (!this.isUserKnown(username)) {
      console.log(getOrIfBlank(`Username ${username} does not exist`, 'Username is empty.'));
    } else {
      this.addValidUserToPlayersTable(username);
      this.form.controls[this.FORM_FIELD_USERNAME].reset();
    }
  }

  private addValidUserToPlayersTable(username: string) {
    this.removePlaceHolderRow();
    this.addedPlayersDataSource.data.push(username);
    // the following new array assignment is needed to trigger change detection and rerender the table
    this.addedPlayersDataSource.data = [...this.addedPlayersDataSource.data];
    this.isSubmitDisabled = false;
  }

  private removePlaceHolderRow(): void {
    if (this.addedPlayersDataSource.data.includes(this.PLACEHOLDER_ROW)) {
      this.addedPlayersDataSource.data = [];
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
        this.dialogRef.close(invitationStatus);
      }
    } else {
      alert(`Cannot create a new game if less than ${this.MINIMUM_PLAYERS_PER_GAME} are selected.`);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
