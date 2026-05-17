import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../shared/models/User';
import { UserDto } from '../shared/dto/user-dto';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak;
  private readonly apiUrl = 'http://localhost:8081/users'; 

  constructor(private http: HttpClient, private userService:UserService) {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'psw-realm',
      clientId: 'psw-angular'
    });
  }

  initKeycloak(): () => Promise<void> {
    return () => this.init();
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        flow: 'standard'
      }).then((authenticated) => {
        if (authenticated) {
          this.userService.createOrUpdateUser().subscribe({
            next: (user) => {
              resolve();
            },
            error: (error) => {
              console.error('Error al obtener usuario:', error);
              reject(error);
            }
          });
        } else {
          reject('No autenticado');
        }
      }).catch(reject);
    });
  }
  
  

  getToken(): string {
    return this.keycloak.token!;
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] || '';
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  getAuthServerUrl(): string {
    return this.keycloak.authServerUrl!;
  }

  getRealm(): string {
    return this.keycloak.realm!;
  }

  getClientId(): string {
    return this.keycloak.clientId!;
  }
}
