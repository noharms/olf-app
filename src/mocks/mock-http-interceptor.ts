import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS } from './mock-user-data';

@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, nextHttpHandler: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.endsWith('/users') && request.method === 'GET') {
            const delayInMs = 0; // to simulate network delay
            return of(new HttpResponse({ status: 200, body: MOCK_USERS })).pipe(delay(delayInMs));
        } else if (request.url.endsWith('/users/0') && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: MOCK_USERS[0] }));
        } else {
            return nextHttpHandler.handle(request);
        }
    }
}
