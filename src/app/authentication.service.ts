import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MOCK_USERS } from 'src/mocks/mock-user-data';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;

  private static readonly CURRENT_USER_KEY = 'currentUser';

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
    const user: User = MOCK_USERS.filter(user => user.name === username)[0];

    // In a real scenario, you'd get the user object from your backend
    // and possibly a token which you'd want to store as well
    localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
