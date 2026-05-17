import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeElement } from '../shared/models/type-element';

@Injectable({
  providedIn: 'root'
})
export class TypeElementService {
  private apiUrl = 'http://localhost:8081/types';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeElement[]> {
    return this.http.get<TypeElement[]>(this.apiUrl);
  }

  getById(id: number): Observable<TypeElement> {
    return this.http.get<TypeElement>(`${this.apiUrl}/${id}`);
  }

  create(typeElement: TypeElement): Observable<TypeElement> {
    return this.http.post<TypeElement>(this.apiUrl, typeElement);
  }

  update(id: number, typeElement: TypeElement): Observable<TypeElement> {
    return this.http.put<TypeElement>(`${this.apiUrl}/${id}`, typeElement);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
