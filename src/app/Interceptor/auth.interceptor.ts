// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from '../core/keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private keycloak: KeycloakService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.keycloak.getToken();

        if (token) {
        const cloned = req.clone({
            setHeaders: {
            Authorization: `Bearer ${token}`
            }
        });
        return next.handle(cloned);
        }

        return next.handle(req);
    }
}
