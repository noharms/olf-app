import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/model/user';

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.component.html',
  styleUrls: ['./invite-form.component.scss']
})
export class InviteFormComponent implements OnInit {
  inviteForm: FormGroup;
  allUsers: User[] = [];
  matchingUsers: Observable<User[]> = of([]);

  constructor() {
    this.inviteForm = new FormGroup({
      username: new FormControl('', Validators.required),
      selectedUser: new FormControl('')
    });
  }

  ngOnInit() {
    const userNameControl: AbstractControl<any, any> | null = this.inviteForm.get('username');
    this.matchingUsers = userNameControl?.valueChanges.pipe(
      startWith(''),
      map(value => this.matchUsersByName(value))
    ) ?? of([]);
  }

  matchUsersByName(fieldInput: string): User[] {
    const lowerCaseInput: string = fieldInput.toLowerCase();
    return this.allUsers.filter(user => user.name.toLowerCase().includes(lowerCaseInput));
  }

  onSelectUser(user: string) {
    // let currentVal = this.inviteForm.get('username').value;
    // if (!currentVal.includes(user)) {
    //   this.inviteForm.get('username').setValue(currentVal ? `${currentVal}, ${user}` : user);
    // }
    console.log(user)
  }

  sendInvitation() {
    console.log('Sending invitation to:', this.inviteForm.get('username')?.value);
    // Implement the logic to send the invitation here
  }
}
