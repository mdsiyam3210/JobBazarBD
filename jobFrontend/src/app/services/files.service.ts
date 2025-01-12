import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private baseUrl = 'http://localhost:8080/api/uploads'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  registerUserImage(fileData: any, userId: number) {
    return this.http.post(`${this.baseUrl}/pfp/${userId}`, fileData);
  }

  registerCvFile(fileData: any, userId: number) {
    return this.http.post(`${this.baseUrl}/pdf/${userId}`, fileData);
  }
}
