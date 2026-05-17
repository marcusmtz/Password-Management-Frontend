import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityReport } from '../shared/dto/SecurityReport';

@Injectable({
  providedIn: 'root'
})
export class SecurityReportService {
  private readonly apiUrl = 'http://localhost:8081/passwords/security-report'; 

  constructor(private http: HttpClient) {}

  getReportByUserId(userId: number): Observable<SecurityReport> {
    return this.http.get<SecurityReport>(`${this.apiUrl}/${userId}`);
  }
}
