import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverletterService {
  private apiUrl = "http://localhost:8080/api/coverletter";

  constructor(private http: HttpClient) { }

  public getCoverLetterByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  public updateCoverLetter(userId: number, coverLetter: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, coverLetter);
  }

  public createCoverLetter(coverLetter: any, userId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}`, coverLetter);
  }
}
