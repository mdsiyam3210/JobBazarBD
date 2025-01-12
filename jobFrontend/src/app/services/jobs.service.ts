import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private apiUrl = "http://localhost:8080/api/jobs";

  constructor(private http: HttpClient) { }

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getJobById(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${jobId}`);
  }

  // Create a new job listing
  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }

  updateJob(jobId: number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${jobId}`, jobData);
  }

  // Delete a job listing
  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${jobId}`);
  }

  getJobByEmployer(employerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employer/${employerId}`);
  }
}
