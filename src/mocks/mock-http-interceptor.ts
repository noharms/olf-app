import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS } from './mock-user-data';
import { User } from 'src/model/user';
import { NewUser } from 'src/model/new-user';

@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, nextHttpHandler: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`Achtung: intercepting the following url ${request.url}.`);

        if (request.url.endsWith('/users') && request.method === 'GET') {
            const delayInMs = 0; // to simulate network delay
            return of(new HttpResponse({ status: 200, body: MOCK_USERS })).pipe(delay(delayInMs));
        } else if (request.url.endsWith('/users') && request.method === 'POST') {

            const body: NewUser = request.body; // in this case we know the body is of that type
            console.log(`The request body reads ${JSON.stringify(body)}.`);

            const newUser: User = new User(
                MOCK_USERS.length,
                body.username,
                "xy",
                new Date()
            );
            MOCK_USERS.push(newUser)
            return of(new HttpResponse({ status: 200, body: newUser }));
        } else if (request.url.endsWith('/users/' + MOCK_USERS[0].id) && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: MOCK_USERS[0] }));
        } else if (request.url.endsWith('/users/' + MOCK_USERS[1].id) && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: MOCK_USERS[1] }));
        } else if (request.url.endsWith('/users/' + MOCK_USERS[2].id) && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: MOCK_USERS[2] }));
        } else {
            console.log(`Achtung: we are in development and the following url ${request.url} is not intercepted.`);
            return nextHttpHandler.handle(request);
        }
    }
}
