import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewUser } from 'src/model/new-user';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersBackendUrl: string = 'https://yourapi.domain.com/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersBackendUrl);
  }

  getUserById(id: number, authToken: string): Observable<User> {
    // TODO: send authToken in header
    return this.http.get<User>(`${this.usersBackendUrl}/${id}`);
  }

  createUser(username: string, password: string): Observable<any> {
    const newUser: NewUser = {
      "username": username,
      "password": password
    };
    console.log('Making POST request to:', this.usersBackendUrl);
    return this.http.post<NewUser>(
      this.usersBackendUrl,
      newUser
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersBackendUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.usersBackendUrl}/${id}`);
  }

  authenticateUser(email: string, password: string): Observable<any> {
    // Assuming you have an endpoint for authentication that expects email and password
    return this.http.post(`${this.usersBackendUrl}/authenticate`, { email, password });
  }

}
