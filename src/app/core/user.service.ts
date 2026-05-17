import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { Observable } from 'rxjs';
import { UserProfileDto } from '../shared/dto/UserProfileDto';
import { UpdateProfilePicRequest } from '../shared/dto/UpdateProfilePicRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8081/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.apiUrl}/profile`);
  }
  

  getIdUserByToken(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/id`);
  }

  getByToken(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/keycloak`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  createOrUpdateUser(): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/me`, {}); 
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteByKeycloak(idKeycloack: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/keycloak/${idKeycloack}`);
  }

  updateProfilePicture(request: UpdateProfilePicRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me/profile-pic`, request);
  }

  removeProfilePicture(): Observable<UserProfileDto> {
    return this.http.put<UserProfileDto>(`${this.apiUrl}/me/profile-pic/remove`, {});
  }
  
}
