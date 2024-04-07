import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MOCK_USERS } from 'src/mocks/mock-user-data';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static readonly CURRENT_USER_KEY = 'currentUser';
  private static readonly AUTH_TOKEN_KEY = 'authToken';

  private currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    const storedUser: User = this.getCurrentUserFromLocalStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
  }

  private getCurrentUserFromLocalStorage(): User {
    const currentUserJson: string = localStorage.getItem(AuthenticationService.CURRENT_USER_KEY) ?? 'null';
    return JSON.parse(currentUserJson);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): void {
    // TODO: check password
    // Placeholder for login logic, should be replaced with real authentication logic
    // For demonstration, we assume login is successful and create a dummy user
    const user: User | undefined = MOCK_USERS.find(user => user.name === username);
    if (!user) {
      console.warn(`Username <${username}> not found.`);
      return;
    }

    // Store the token in local storage or in-memory storage for later use
    const token: string = this.generateTokenForUser(user);
    localStorage.setItem(AuthenticationService.AUTH_TOKEN_KEY, token);

    // In a real scenario, you'd get the user object from your backend
    // and possibly a token which you'd want to store as well
    localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(user));
    // the call to "next" will set a new value and then notify all observers
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(AuthenticationService.CURRENT_USER_KEY);
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
