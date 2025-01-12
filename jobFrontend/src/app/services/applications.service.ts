import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = "http://localhost:8080/api/applications"

  constructor(private http: HttpClient) { }

  getApplicationsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  getAllApplications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  applyForJob(jobData: any): Observable<any> {
    return this.http.post(this.apiUrl, jobData);
  }

  getApplicationsForJob(jobId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/job/${jobId}`);
  }

  makeApplicationDecision(appId:  number, decision: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${appId}`, {"status": decision});
  }

  deleteApplication(appId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${appId}`);
  }
}
