import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/user.service';
import { User } from 'src/model/user';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent {

  private readonly INVALID_USERNAME_INVALID_PASSWORD: string = 'Type a valid username and password.';
  private readonly VALID_USERNAME_VALID_PASSWORD: string = 'Username and password seem valid at first glance.';
  private readonly INVALID_USERNAME_VALID_PASSWORD: string = 'Type a valid username.';
  private readonly VALID_USERNAME_INVALID_PASSWORD: string = 'Type a valid password.';

  readonly USERNAME_FIELD_NAME: string = 'username';
  readonly PASSWORD_FIELD_NAME: string = 'password';

  signUpForm: FormGroup;
  statusMessage: string = this.INVALID_USERNAME_INVALID_PASSWORD;

  constructor(
    private formBuilder: FormBuilder,
    // note: this is automatically filled accordingly when this component is opened using MatDialog#open
    private dialogRef: MatDialogRef<SignUpModalComponent>,
    private userService: UserService
  ) {
    this.signUpForm = this.formBuilder.group({
      // CAVEAT: the field names chosen here must be used when accessing fields pf the form elsewhere
      username: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signUpForm.valueChanges.subscribe(
      ignored => {
        this.updateStatusMessage();
      }
    );
  }

  updateStatusMessage() {
    const isUsernameValid: boolean = this.signUpForm.get(this.USERNAME_FIELD_NAME)?.valid ?? false;
    const isPasswordValid: boolean = this.signUpForm.get(this.PASSWORD_FIELD_NAME)?.valid ?? false;
    if (isUsernameValid && isPasswordValid) {
      this.statusMessage = this.VALID_USERNAME_VALID_PASSWORD;
    } else if (!isUsernameValid && isPasswordValid) {
      this.statusMessage = this.INVALID_USERNAME_VALID_PASSWORD;
    } else if (isUsernameValid && !isPasswordValid) {
      this.statusMessage = this.VALID_USERNAME_INVALID_PASSWORD;
    } else {
      this.statusMessage = this.INVALID_USERNAME_INVALID_PASSWORD;
    }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      const username: string = this.signUpForm.get(this.USERNAME_FIELD_NAME)?.value;
      const password: string = this.signUpForm.get(this.PASSWORD_FIELD_NAME)?.value;
      console.log(username + ", " + password);
      this.userService.createUser(username, password).subscribe(
        createdUser => console.log(`Created new user: ${createdUser}`)
      );
      // TODO auto login new user
      this.dialogRef.close();
    }
  }

  checkUsernameExists() {
    const username = this.signUpForm.get('username')?.value;
    // Implement username existence check here
    // This could involve calling a backend API to check the username
  }

  onCancel() {
    this.dialogRef.close();
  }
}
