import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Password } from '../shared/models/password';
import { PasswordDto } from '../shared/dto/Password-dto';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = 'http://localhost:8081/passwords';

  constructor(private http: HttpClient) {}

  getAllPasswords(): Observable<Password[]> {
    return this.http.get<Password[]>(this.apiUrl);
  }

  getPasswordsByUserId(userId: number): Observable<Password[]> {
    return this.http.get<Password[]>(`${this.apiUrl}/user/${userId}`);
  }

  getPasswordById(id: number): Observable<Password> {
    return this.http.get<Password>(`${this.apiUrl}/${id}`);
  }

  createPassword(request: PasswordDto): Observable<Password> {
    return this.http.post<Password>(this.apiUrl, request);
  }

  updatePassword(id: number, request: PasswordDto): Observable<Password> {
    return this.http.put<Password>(`${this.apiUrl}/${id}`, request);
  }

  deletePassword(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFavoriteCountByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/favorites/count/${userId}`);
  }
  
}
