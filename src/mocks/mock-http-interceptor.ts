import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from 'src/model/user';


const users: User[] = [
    { id: 0, name: 'John Doe', email: 'john@example.com', registrationDate: new Date() },
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', registrationDate: new Date() },
    // Add more users as needed
];

@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, nextHttpHandler: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.endsWith('/users') && request.method === 'GET') {
            const delayInMs = 0; // to simulate network delay
            return of(new HttpResponse({ status: 200, body: users })).pipe(delay(delayInMs));
        } else if (request.url.endsWith('/users/0') && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: users[0] }));
        } else {
            return nextHttpHandler.handle(request);
        }
    }
}
