import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../../core/keycloak.service';
import { UserService } from '../../../core/user.service';
import { catchError, retryWhen, take, timer, of, delayWhen } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UserProfileDto } from '../../dto/UserProfileDto';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  user: UserProfileDto | null = null;

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().pipe(
      retryWhen(errors =>
        errors.pipe(delayWhen(() => timer(500)),
        take(5))
      ),
      catchError(err => {
        console.error('❌ No se pudo obtener el usuario después de varios intentos:', err);
        return of(null);
      })
    ).subscribe((data) => {
      this.user = data;
    });
  }

  logout(): void {
    this.keycloakService.logout();
  }

  goToAccountSettings(): void {
    const keycloakUrl = this.keycloakService.getAuthServerUrl();
    const realm = this.keycloakService.getRealm();
    const clientId = this.keycloakService.getClientId();
    const redirectUri = window.location.origin;

    const url = `${keycloakUrl}/realms/${realm}/account?referrer=${clientId}&referrer_uri=${redirectUri}`;
    localStorage.setItem('profileEdited', 'true');
    window.location.href = url;
  }

  closeDropdown(): void {
    const dropdown = document.getElementById('dropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  }

  getProfilePic(): string {
    return this.user?.profilePic?.trim()
      ? this.user.profilePic
      : '/img/profilePic.png';
  }
  
}
