import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { MOCK_USERS } from 'src/mocks/mock-user-data';
import { User } from 'src/model/user';
import { TOP_LEVEL_DOMAIN_NAME } from './app-routing.module';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static readonly CURRENT_USER_ID = 'currentUserId';
  private static readonly AUTH_TOKEN_KEY = 'authToken';

  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);

    //----- TODO: this is a hack to avoid login during development
    localStorage.clear();
    this.login(MOCK_USERS[1].name, "NOT CHECKING PASSWORD AT THE MOMENT");
    //-----
    const userIdWithToken: [string, string] = this.retrieveUserIdAndTokenFromStorage();
    this.tryInitializeCurrentUserSubject(userIdWithToken);
  }

  private retrieveUserIdAndTokenFromStorage(): [string, string] {
    const userId: string = localStorage.getItem(AuthenticationService.CURRENT_USER_ID) ?? "";
    const authToken: string = localStorage.getItem(AuthenticationService.AUTH_TOKEN_KEY) ?? "";
    return [userId, authToken];
  }

  private tryInitializeCurrentUserSubject(userIdWithToken: [string, string]) {
    const userId: number = parseInt(userIdWithToken[0]);
    const authToken: string = userIdWithToken[1];
    if (this.validateToken(authToken)) {
      this.initializeCurrentUserSubject(userId, authToken);
    }
  }

  private initializeCurrentUserSubject(userId: number, authToken: string): void {
    this.userService.getUserById(userId, authToken).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: () => {
        // handle errors, possibly token invalid or user not found
        console.log("User could not be retrieved. Redirecting to login page.")
        this.logout();
        this.router.navigate([TOP_LEVEL_DOMAIN_NAME]);
      }
    });
  }

  public get currentUser(): User | null {
    if (!this.currentUserSubject.value) {
      console.log("Current user is null!")
    }
    return this.currentUserSubject.value;
  }

  public get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): void {
    // TODO: check password
    // Placeholder for login logic, should be replaced with real authentication logic
    // For demonstration, we assume login is successful and create a dummy user
    console.log("Known mock users in login: " + MOCK_USERS.map(u => u.name))
    const user: User | undefined = MOCK_USERS.find(user => user.name === username);
    if (!user) {
      console.warn(`Username <${username}> not found.`);
      this.logout();
    } else {
      // TODO: the user and token should come from the backend
      const token: string = this.generateTokenForUser(user);
      localStorage.setItem(AuthenticationService.AUTH_TOKEN_KEY, token);
      localStorage.setItem(AuthenticationService.CURRENT_USER_ID, JSON.stringify(user.id));
      // the call to "next" will set a new value and then notify all observers
      this.currentUserSubject.next(user);
    }
  }

  logout(): void {
    localStorage.removeItem(AuthenticationService.CURRENT_USER_ID);
    localStorage.removeItem(AuthenticationService.AUTH_TOKEN_KEY);
    // the call to "next" will set a new value and then notify all observers
    this.currentUserSubject.next(null);
  }

  public get authToken(): string | null {
    return localStorage.getItem(AuthenticationService.AUTH_TOKEN_KEY);
  }

  private generateTokenForUser(user: User): string {
    // In a real application, the token would be generated by the backend.
    // For simulation, we just encode the username and a timestamp or any other simple logic.
    return btoa(`${user.name}:${new Date().getTime()}`);
  }

  // This could be part of a fake backend service
  validateToken(token: string): boolean {
    // In a real scenario, the backend would validate the token's signature and data
    // Here, we just simulate a validation by checking if the token is not null
    return token != null;
  }

}
