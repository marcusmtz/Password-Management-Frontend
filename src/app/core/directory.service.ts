import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Directory } from '../shared/models/directory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private apiUrl = 'http://localhost:8081/directories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Directory[]> {
    return this.http.get<Directory[]>(this.apiUrl);
  }

  getById(id: number): Observable<Directory> {
    return this.http.get<Directory>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: number): Observable<Directory[]> {
    return this.http.get<Directory[]>(`${this.apiUrl}/user/${userId}`);
  }


  create(directory: Directory): Observable<Directory> {
    return this.http.post<Directory>(this.apiUrl, directory);
  }

  update(id: number, directory: Directory): Observable<Directory> {
    return this.http.put<Directory>(`${this.apiUrl}/${id}`, directory);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
